import React, { Component } from 'react';
import { BrowserRouter, Link, Switch, Route, Redirect } from 'react-router-dom';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import {
    getCart as getCartFromCache,
    setCart as setCartIntoCache
} from '../utils/cache';

const styles = createStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: '980px',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    breadcrumbs: {
        marginRight: 'auto'
    },
    link: {
        color: '#fff',
        display: 'flex',
        textDecoration: 'none'
    },
    icon: {
        color: '#fff',
        marginRight: theme.spacing(0.5),
    },
    separatorIcon: {
        color: '#fff',
    }
}));

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cart: {},
            pageIcon: '',
            pageTitle: '',
            pageRoute: ''
        };
    }

    componentDidMount() {
        this.setState({ cart: getCartFromCache() || {} });
    }

    updatePage = (icon, title, route) => {
        this.setState({ pageIcon: icon, pageTitle: title, pageRoute: route, cart: getCartFromCache() || {} });
    }

    updateCart = (productId, count) => {
        var cart = getCartFromCache() || {};
        cart[productId] = (cart[productId] || 0) + count;

        setCartIntoCache(cart);

        this.setState({ cart: cart });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <BrowserRouter>
                    <div className={classes.root}>
                        <AppBar position='static'>
                            <Toolbar>
                                <Breadcrumbs className={classes.breadcrumbs} separator={<NavigateNextIcon className={classes.separatorIcon} />} >
                                    <Link to="/products" className={classes.link}>
                                        <HomeIcon className={classes.icon} /> Mobile store
                                    </Link>
                                    <Link to={this.state.pageRoute} className={classes.link}>
                                        {this.state.pageIcon}{this.state.pageTitle}
                                    </Link>
                                </Breadcrumbs>
                                <IconButton color='inherit'>
                                    <Badge badgeContent={Object.values(this.state.cart).reduce((a, b) => a + b, 0)} color='secondary'>
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                    </div>
                    <div className={classes.root}>
                        <Switch>
                            <Route
                                path='/products'
                                exact
                                render={(props) => (
                                    <ProductList {...props} updatePage={this.updatePage} />
                                )}
                            />
                            <Route
                                path='/product/:id'
                                exact
                                strict
                                render={(props) => (
                                    <ProductDetail {...props} updatePage={this.updatePage} updateCart={this.updateCart} />
                                )}
                            />
                            <Redirect to='/products' />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default withStyles(styles)(App);