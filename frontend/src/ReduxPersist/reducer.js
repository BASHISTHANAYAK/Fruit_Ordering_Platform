// reducer.js
import { SET_USER, LOGOUT_USER } from "./actions";

const initialState = {
  isLoggedIn: false,
  isLoggedOut: true,
  name: "",
  role: "",
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
    default:
      return state;
  }
};

export default userReducer;
