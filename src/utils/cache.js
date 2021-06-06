const PRODUCTS_KEY = 'Products';
const PRODUCT_KEY = 'Product';
const CART_KEY = 'Cart';
const LIMIT_TIME = 60 * 60 * 1000;

function putInTheCache(key, value) {
  localStorage.setItem(key, JSON.stringify({
    data: value,
    date: Date.now(),
  }));
}

function getFromCache(key) {
  let storedData = localStorage.getItem(key);
  if (storedData) {
    storedData = JSON.parse(storedData);
    if ((Date.now() - storedData.date) >= LIMIT_TIME) {
      storedData = null;
    }
  }
  return storedData?.data;
}

export function getProducts() {
  return getFromCache(PRODUCTS_KEY);
}

export function setProducts(products) {
  putInTheCache(PRODUCTS_KEY, products);
}

export function getProduct(id) {
  return getFromCache(`${PRODUCT_KEY}_${id}`);
}

export function setProduct(product) {
  putInTheCache(`${PRODUCT_KEY}_${product.id}`, product);
}

export function getCart() {
  return getFromCache(CART_KEY);
}

export function setCart(cart) {
  return putInTheCache(CART_KEY, cart);
}
