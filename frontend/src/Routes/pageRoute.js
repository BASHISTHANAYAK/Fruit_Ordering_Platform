import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "../pages/adminLogin/loginUi.js";
// import Signup from "../pages/adminSignup/signupUi.js";
import Home from "../pages/Homepage/home.js";
import PageNotFound from "../pages/PageNotFound/PageNotFound.jsx";
import AdminORBuyer from "../pages/Log-Reg-For_BuyerANDAdmin/Admin_OR_Buyer.jsx";
import AdminSignup from "../pages/adminSignup/signupUi.js";
import BuyerSignup from "../pages/buyerSignup/signupUi.js";
import BuyerLogin from "../pages/buyerLogin/loginUi.js";
import CreateProduct from "../pages/createProductPage/CreateProduct.jsx";
import AdminDashBoard from "../pages/AdminDashboard/AdminDashBoard.jsx";
import AdminLogin from "../pages/adminLogin/AdminLoginUi.js";
import {
  AdminProtectedRoute,
  BuyerProtectedRoute,
} from "./ProtectedRouteComponent.jsx";
import Cart from "../pages/CartPage/Cart.jsx";
import EditProduct from "../pages/EditProductPage/EditProduct.jsx";
// import EditPage from "../pages/EditAdmin_ProductPage/EditPage.jsx";

const pageRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      

        {/* ------------------------------------------------------------- */}
        <Route path="/selectAccountType" element={<AdminORBuyer />} />
        <Route path="/adminSignup" element={<AdminSignup />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/buyerSignup" element={<BuyerSignup />} />
        <Route path="/buyerLogin" element={<BuyerLogin />} />
        {/*Cart */}
        <Route
          path="/cart"
          element={
            <BuyerProtectedRoute>
              <Cart />
            </BuyerProtectedRoute>
          }
        />
        <Route
          path="/createProduct"
          element={
            <AdminProtectedRoute>
              <CreateProduct />
            </AdminProtectedRoute>
          }
        />
        {/* Protected Route */}
        <Route
          path="/adminDashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashBoard />
            </AdminProtectedRoute>
          }
        />
 

        {/* EditProduct */}
        <Route
          path="/editProduct/:productId"
          element={
            <AdminProtectedRoute>
              <EditProduct />
            </AdminProtectedRoute>
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default pageRoute;

// {/* <AdminProtectedRoute
//   path="/adminDashboard"
//   component={<AdminDashBoard />}
// /> */}
