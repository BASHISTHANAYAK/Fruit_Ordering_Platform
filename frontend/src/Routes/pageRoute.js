import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "../pages/adminLogin/loginUi.js";
// import Signup from "../pages/adminSignup/signupUi.js";
import Home from "../pages/Homepage/home.js";
import ProductDetail from "../pages/ProductDetails/productDetail.js";
import ViewCart from "../pages/Viewcart/viewCart.js";
import CheckOut from "../pages/CheckOutPage/checkOut.js";
import Successful from "../pages/successfulPage/successful.js";
import SearchNav from "../components/Search In Navbar/searchNav.js";
import PageNotFound from "../pages/PageNotFound/PageNotFound.jsx";
import AdminORBuyer from "../pages/Log-Reg-For_BuyerANDAdmin/Admin_OR_Buyer.jsx";
import AdminSignup from "../pages/adminSignup/signupUi.js";
import AdminLogin from "../pages/adminLogin/loginUi.js";
import BuyerSignup from "../pages/buyerSignup/signupUi.js";
import BuyerLogin from "../pages/buyerLogin/loginUi.js";

const pageRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        <Route path="/productDetail/:_id" element={<ProductDetail />} />
        <Route path="/viewCart" element={<ViewCart />} />
        <Route path="/checkOutPage" element={<CheckOut />} />
        <Route path="/successfulPage" element={<Successful />} />
        <Route path="/SearchNav" element={<SearchNav />} />
        <Route path="/selectAccountType" element={<AdminORBuyer />} />
        <Route path="/adminSignup" element={<AdminSignup />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/buyerSignup" element={<BuyerSignup />} />
        <Route path="/buyerLogin" element={<BuyerLogin />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default pageRoute;
