import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  getProduct as getProductFromApi,
  addToCart
} from '../utils/api';
import {
  getProduct as getProductFromCache,
  setProduct as setProductIntoCache
} from '../utils/cache';

const styles = createStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    margin: 'auto'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardImage: {
    marginRight: 16,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContentMainProperties: {
    paddingTop: 0,
    paddingBottom: 0
  },
  cardActionsMainProperties: {
    paddingLeft: 16
  },
  cardContentMoreProperties: {
    paddingTop: 0
  },
  cardOptions: {
    marginTop: 16
  },
  cardContentOptions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  unorderedList: {
    margin: 0
  },
  titleListItem: {
    textTransform: 'capitalize'
  },
  select: {
    minWidth: 150,
    marginRight: theme.spacing(2)
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  link: {
    width: '60px',
    display: 'flex',
    textDecoration: 'none'
  },
}));

const mainProperties = [
  { title: 'CPU', key: 'cpu' },
  { title: 'RAM', key: 'ram' },
  { title: 'Operating System', key: 'os' },
  { title: 'Screen Resolution', key: 'displaySize' },
  { title: 'Battery', key: 'battery' },
  { title: 'Primary Camera', key: 'primaryCamera' },
  { title: 'Secondary Camera', key: 'secondaryCmera' },
  { title: 'Dimensions', key: 'dimentions' },
  { title: 'Weight', key: 'weight' }
];

const propertiesToExclude = ['id', 'brand', 'model', 'price', 'imgUrl', 'options'].concat(mainProperties.map(mainProperty => mainProperty.key));

class ProductDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {},
      color: '',
      storage: '',
      loading: true,
      expanded: false,
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    this.props.updatePage(<PhoneAndroidIcon />, 'Product Detail', `/product/${id}`);

    const product = getProductFromCache(id);
    if (product) {
      this.setProduct(product);
    } else {
      getProductFromApi(id)
        .then((res) => {
          this.setProduct(res.data);
          setProductIntoCache(res.data);
        })
        .catch((err) => console.error(err));
    }
  }

  setProduct(product) {
    const { colors, storages } = product?.options;
    this.setState({
      data: product,
      color: colors?.length === 1 ? colors[0].code : '',
      storage: storages?.length === 1 ? storages[0].code : '',
      loading: false
    });
  }

  renderLoading = (classes) => {
    return (
      <div className={classes.loading}>
        <CircularProgress />&nbsp;<strong>Loading...</strong>
      </div>
    );
  }

  renderProductDetail = (classes) => {
    const { data } = this.state;
    const productTitle = `${data?.brand?.toUpperCase()} ${data?.model}`;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Link to='/products' className={classes.link}>
            <ArrowBackIcon />Back
          </Link>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.cardImage}>
            <img src={data.imgUrl} alt={productTitle} />
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <CardHeader
              title={productTitle}
              subheader={`${data.price || '-'} €`}
              subheaderTypographyProps={{
                color: 'secondary'
              }}
            />
            <CardContent className={classes.cardContentMainProperties}>
              <Typography variant='body2' component='div'>
                <ul className={classes.unorderedList}>
                  {mainProperties.map(mainProperty => this.renderListItem(classes, mainProperty.title, mainProperty.key, data[mainProperty.key]))}
                </ul>
              </Typography>
            </CardContent>
            <CardActions className={classes.cardActionsMainProperties}>
              <Typography variant='body2'>
                <strong>More Properties...</strong>
              </Typography>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: this.state.expanded,
                })}
                onClick={() => this.setState({ expanded: !this.state.expanded })}
                aria-expanded={this.state.expanded}
                aria-label='show more'
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
              <CardContent className={classes.cardContentMoreProperties}>
                <Typography variant='body2' component='div'>
                  <ul className={classes.unorderedList}>
                    {Object.entries(data)
                      .filter(([key]) => !propertiesToExclude.includes(key))
                      .map(([key, value]) => this.renderListItem(classes, key.replace(/([a-z0-9])([A-Z])/g, '$1 $2'), key, value))}
                  </ul>
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
          <Card className={classes.cardOptions}>
            <CardHeader title='Options' />
            <CardContent className={classes.cardContentOptions}>
              <FormControl variant='outlined' className={classes.select}>
                <InputLabel id='storage-label'>Storage</InputLabel>
                <Select
                  labelId='storage-label'
                  id='storage-select'
                  value={this.state.storage}
                  onChange={(event) => this.setState({ storage: event.target.value })}
                  label='Storage'
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {data?.options?.storages?.map(storage => <MenuItem key={storage.code} value={storage.code}>{storage.name}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl variant='outlined' className={classes.select}>
                <InputLabel id='color-label'>Color</InputLabel>
                <Select
                  labelId='color-label'
                  id='color-select'
                  value={this.state.color}
                  onChange={(event) => this.setState({ color: event.target.value })}
                  label='Color'
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {data?.options?.colors?.map(color => <MenuItem key={color.code} value={color.code}>{color.name}</MenuItem>)}
                </Select>
              </FormControl>
              <Button
                variant='contained'
                color='primary'
                size='large'
                startIcon={<AddShoppingCartIcon />}
                disabled={this.state.color === '' || this.state.storage === ''}
                onClick={() => {
                  addToCart(this.state.data.id, this.state.color, this.state.storage)
                    .then((res) => this.props.updateCart(this.state.data.id, res.data.count))
                    .catch((err) => console.error(err));
                }}
              >
                BUY
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  renderListItem = (classes, title, key, value) => {
    return (
      <li key={key}><strong className={classes.titleListItem}>{title}:</strong>&nbsp;{Array.isArray(value) ? <ul>{value.map((item, index) => <li key={`${key}_${index}`}>{item || '-'}</li>)}</ul> : value || '-'}</li>
    );
  }

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    return (
      <Paper className={classes.root}>
        {loading ? this.renderLoading(classes) : this.renderProductDetail(classes)}
      </Paper>
    );
  }
}

export default withStyles(styles)(ProductDetail);