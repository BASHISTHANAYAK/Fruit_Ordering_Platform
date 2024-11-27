// actions.js
export const SET_USER = "SET_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const ADD_TO_CART = "ADD_TO_CART";

// Action to set user data after login
export const setUser = (userData) => ({
  type: SET_USER,
  payload: userData,
});

// Action to log out the user
export const logoutUser = () => ({
  type: LOGOUT_USER,
});

//ADD_TO_CART
export const addtocart = (productObj) => ({
  type: ADD_TO_CART,
  payload:productObj
});