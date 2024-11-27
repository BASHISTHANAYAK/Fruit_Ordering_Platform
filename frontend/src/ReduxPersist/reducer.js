// reducer.js
import { SET_USER, LOGOUT_USER, ADD_TO_CART } from "./actions";

const initialState = {
  isLoggedIn: false,
  isLoggedOut: true,
  name: "",
  role: "",
  _id: null,
  cart: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      // Return new state with user data after login
      return {
        ...state,
        isLoggedIn: true,
        isLoggedOut: false,
        name: action.payload.name,
        role: action.payload.role,
        _id: action.payload._id,
      };
    case LOGOUT_USER:
      // Return new state after logging out
      return {
        ...state,
        isLoggedIn: false,
        isLoggedOut: true,
        name: "",
        role: "",
      };
    case ADD_TO_CART:
      return {
        ...state,
        cart: state.cart.some((item) => item._id === action.payload._id)
          ? state.cart.map((item) =>
              item._id === action.payload._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...state.cart, { ...action.payload, quantity: 1 }],
      };
    default:
      return state;
  }
};

export default userReducer;
