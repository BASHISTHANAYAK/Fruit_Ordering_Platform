import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ProtectedRoute component
const BuyerProtectedRoute = ({ children }) => {
  const dataFromRedux = useSelector((state) => state);
  console.log("BuyerProtectedRoute  ,redux->", dataFromRedux);
  const isAuthenticated =
    dataFromRedux.isLoggedIn && dataFromRedux.role === "Buyer";

  if (!isAuthenticated) {
    return <Navigate to="/buyerLogin" />;
  }
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const dataFromRedux = useSelector((state) => state);
  console.log("AdminProtectedRoute redux data:", dataFromRedux);

  const isAuthenticated =
    dataFromRedux.isLoggedIn && dataFromRedux.role === "Admin";

  if (!isAuthenticated) {
    return <Navigate to="/adminLogin" />;
  }
  return children;
};

export { BuyerProtectedRoute, AdminProtectedRoute };

// isLoggedIn
// :
// true
// isLoggedOut
// :
// false
// name
// :
// "user1"
// role
// :
// "Buyer"
