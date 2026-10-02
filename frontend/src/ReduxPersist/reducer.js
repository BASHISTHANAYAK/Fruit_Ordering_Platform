// reducer.js
import {
  SET_USER,
  LOGOUT_USER,
  SET_PRODUCTS,
  SET_CART,
  UPDATE_CART_ITEM,
} from "./actions";

const initialState = {
  isLoggedIn: false,
  isLoggedOut: true,
  name: "",
  role: "",
  _id: null,
  cachedProducts: [], // Industry standard caching to prevent redundant API calls
  cartItems: [],      // Buyer's cached cart items
  cartCount: 0,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isLoggedIn: true,
        isLoggedOut: false,
        name: action.payload.name,
        role: action.payload.role,
        _id: action.payload._id,
      };

    case LOGOUT_USER:
      return {
        ...state,
        isLoggedIn: false,
        isLoggedOut: true,
        name: "",
        role: "",
        _id: null,
        cachedProducts: [],
        cartItems: [],
        cartCount: 0,
      };

    case SET_PRODUCTS:
      return {
        ...state,
        cachedProducts: action.payload,
      };

    case SET_CART: {
      const items = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        cartItems: items,
        cartCount: items.length,
      };
    }

    case UPDATE_CART_ITEM: {
      const { productId, quantity } = action.payload;
      const updated = state.cartItems.map((item) => {
        if (item.product && item.product._id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      return {
        ...state,
        cartItems: updated,
      };
    }

    default:
      return state;
  }
};

export default userReducer;
