import axios from 'axios';

export function getProducts() {
  return axios.get('https://front-test-api.herokuapp.com/api/product');
}

export function getProduct(id) {
  return axios.get(`https://front-test-api.herokuapp.com/api/product/${id}`);
}

export function addToCart(id, colorCode, storageCode) {
  return axios({
    method: 'post',
    url: 'https://front-test-api.herokuapp.com/api/cart',
    data: {
      id,
      colorCode,
      storageCode,
    },
  });
}
