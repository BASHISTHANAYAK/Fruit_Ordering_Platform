// store.js

import { legacy_createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import userReducer from "./reducer";

// Configure Redux-Persist
const persistConfig = {
  key: "root",
  storage, // Use localStorage
};

const persistedReducer = persistReducer(persistConfig, userReducer);

// Create the Redux store with the persisted reducer
const store = legacy_createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
