import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import ListIcon from '@material-ui/icons/List';
import {
    getProducts as getProductsFromApi
} from '../utils/api';
import {
    getProducts as getProductsFromCache,
    setProducts as setProductsIntoCache
} from '../utils/cache';

const styles = createStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    gridList: {
        width: '100%'
    },
    gridListTitle: {
        height: 'auto !important',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    image: {
        width: 160,
        height: 212
    },
    link: {
        textDecoration: 'none'
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

class ProductList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            products: [],
            productsToShow: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.props.updatePage(<ListIcon />, 'Product List', '/products');

        const products = getProductsFromCache();
        if (products) {
            this.setProducts(products);
        } else {
            getProductsFromApi()
                .then((res) => {
                    this.setProducts(res.data);
                    setProductsIntoCache(res.data);
                })
                .catch((err) => console.error(err));
        }
    }

    setProducts(products) {
        this.setState({ products: products, productsToShow: products, loading: false });
    }

    renderLoading = (classes) => {
        return (
            <div className={classes.loading}>
                <CircularProgress />&nbsp;<strong>Loading...</strong>
            </div>
        );
    }

    renderProductList = (classes) => {
        const { productsToShow } = this.state;
        return (
            <GridList cellHeight={212} className={classes.gridList} cols={4}>
                <GridListTile key='Subheader' cols={4} className={classes.gridListTitle}>
                    <TextField
                        id='input-search'
                        placeholder='Search products...'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={(event) => {
                            const filterValue = event.target.value.toLowerCase();
                            const { products } = this.state;
                            this.setState({ productsToShow: filterValue === '' ? products : products.filter(product => product.brand.toLowerCase().includes(filterValue) || product.model.toLowerCase().includes(filterValue)) });
                        }}
                    />
                </GridListTile>
                {productsToShow.map((productToShow) => {
                    const productDetail = `${productToShow.brand.toUpperCase()} ${productToShow.model}`;
                    return (
                        <GridListTile key={productToShow.id}>
                            <img src={productToShow.imgUrl} alt={productDetail} className={classes.image} />
                            <GridListTileBar
                                title={productDetail}
                                subtitle={<span>{`${productToShow.price || '-'} €`}</span>}
                                actionIcon={
                                    <Link to={`/product/${productToShow.id}`} className={classes.link}>
                                        <IconButton aria-label={`info about ${productDetail}`} className={classes.icon}>
                                            <InfoIcon />
                                        </IconButton>
                                    </Link>
                                }
                            />
                        </GridListTile>
                    )
                })}
            </GridList>
        );
    }

    render() {
        const { classes } = this.props;
        const { loading } = this.state;
        return (
            <Paper className={classes.root}>
                {loading ? this.renderLoading(classes) : this.renderProductList(classes)}
            </Paper>
        );
    }
}

export default withStyles(styles)(ProductList);