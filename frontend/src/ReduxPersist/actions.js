// actions.js
export const SET_USER = "SET_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const SET_PRODUCTS = "SET_PRODUCTS";
export const SET_CART = "SET_CART";
export const UPDATE_CART_ITEM = "UPDATE_CART_ITEM";

// Action to set user data after login
export const setUser = (userData) => ({
  type: SET_USER,
  payload: userData,
});

// Action to log out the user
export const logoutUser = () => ({
  type: LOGOUT_USER,
});

// Action to cache all products
export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products,
});

// Action to cache buyer's cart items
export const setCart = (cartItems) => ({
  type: SET_CART,
  payload: cartItems,
});

// Action to update single cart item quantity in Redux
export const updateCartItem = (productId, quantity) => ({
  type: UPDATE_CART_ITEM,
  payload: { productId, quantity },
});
