import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/loginUi.js";
import Signup from "../pages/signup/signupUi.js";
import Home from "../pages/Homepage/home.js";
import ProductDetail from "../pages/ProductDetails/productDetail.js";
import ViewCart from "../pages/Viewcart/viewCart.js";
import CheckOut from "../pages/CheckOutPage/checkOut.js";
import Successful from "../pages/successfulPage/successful.js";
import SearchNav from "../components/Search In Navbar/searchNav.js";
import PageNotFound from "../pages/PageNotFound/PageNotFound.jsx";

const pageRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/productDetail/:_id" element={<ProductDetail />} />
        <Route path="/viewCart" element={<ViewCart />} />
        <Route path="/checkOutPage" element={<CheckOut />} />
        <Route path="/successfulPage" element={<Successful />} />
        <Route path="/SearchNav" element={<SearchNav />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default pageRoute;
