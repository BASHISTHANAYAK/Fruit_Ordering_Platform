import axios from "axios";
import serverUrl from "../config";
import { store } from "../ReduxPersist/store";
import { logoutUser } from "../ReduxPersist/actions";

const api = axios.create({
  baseURL: serverUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper: read token from sessionStorage or localStorage
export function getStoredToken() {
  let token = sessionStorage.getItem("jwttoken") || localStorage.getItem("jwttoken");
  if (!token) return null;
  // If token was stored with quotes (from JSON.stringify)
  if (typeof token === "string") {
    token = token.trim();
    if (token.startsWith('"') && token.endsWith('"')) {
      try {
        token = JSON.parse(token);
      } catch (e) {
        token = token.slice(1, -1);
      }
    }
  }
  return token;
}

// Request interceptor: attach Authorization header if token exists
// CRITICAL: NEVER dispatch logoutUser here, because public endpoints (like getAllProducts)
// should not logout an authenticated user if called before token is read!
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: only auto-logout if a PROTECTED route returns 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = (error.config && error.config.url) || "";
      // Public routes that should not trigger global logout on 401
      const isPublicRoute =
        url.includes("Login") ||
        url.includes("Signup") ||
        url.includes("getAllProducts");

      if (!isPublicRoute) {
        sessionStorage.clear();
        localStorage.clear();
        store.dispatch(logoutUser());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
