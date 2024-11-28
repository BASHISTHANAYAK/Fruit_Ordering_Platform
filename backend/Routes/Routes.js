import express from "express";
// import {
//   signupRoute,
//   loginRoute,
//   addToCart,
//   getUserDetails,
//   updateQuantity,
//   emptyCart,
//   test,
// } from "../controllers/userController.js";
// import { filterProduct, productById } from "../controllers/allProducts.js";

// ---------------------
import {
  adminLoginRoute,
  AdminSignupRoute,
  getAllPlacedOrdersByAdmin,
} from "../controllers/AdminController.js";
import {
  addToCart,
  buyerLoginRoute,
  buyerSignupRoute,
  fetchOrders,
  getcartProducts,
  placeOrder,
} from "../controllers/BuyerController.js";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getProductById,
  getProductsByAdmin,
} from "../controllers/ProductsController.js";
import adminAuth from "../middlewares/adminAuth.js";
import userAuth from "../middlewares/userAuth.js";
import TestingROute from "../controllers/TestingROute.js";
const router = express.Router();

// --------------------------------------
//TestingROute
router.get("/", TestingROute);

//getAllProducts
router.get("/getAllProducts", getAllProducts);
// Admin SignUP
router.post("/adminSignup", AdminSignupRoute);
//adminLoginRoute
router.post("/adminLogin", adminLoginRoute);
//products
router.post("/createProduct", adminAuth, createProduct);
///deleteProduct/${productId}
router.delete("/deleteProduct/:productId", adminAuth, deleteProduct);

// --------------------------------------
//Buyer routes
router.post("/buyerSignup", buyerSignupRoute);
//adminLoginRoute
router.post("/buyerLogin", buyerLoginRoute);
// // to add productsID in usercart
router.post("/addToCart/:buyerId", userAuth, addToCart);
//placeOrder
router.post("/placeOrder", userAuth, placeOrder);

//----------------------------------------
//getcartProducts
router.get("/getcartProducts/:buyerId", userAuth, getcartProducts);
///getOrders
router.get("/getOrders/:_id", userAuth, fetchOrders);
router.get("/getProducts/:adminId", adminAuth, getProductsByAdmin);
//getProductById
router.get("/getProductById/:productId", adminAuth, getProductById);
//editProduct
router.put("/editProduct/:productId", adminAuth, editProduct);
//getAllPlacedOrdersByAdmin
router.get(
  "/getAllPlacedOrdersByAdmin/:adminId",
  adminAuth,
  getAllPlacedOrdersByAdmin
);

export default router;
