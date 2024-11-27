// src/api/api.js
import axios from "axios";
import serverUrl from "../config";

const api = axios.create({
  baseURL: serverUrl, // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to automatically add the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jwttoken"); // Retrieve the token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
