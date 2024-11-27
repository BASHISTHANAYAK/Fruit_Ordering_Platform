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
} from "../controllers/AdminController.js";
import {
  addToCart,
  buyerLoginRoute,
  buyerSignupRoute,
} from "../controllers/BuyerController.js";
import {
  createProduct,
  getAllProducts,
} from "../controllers/ProductsController.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

// router.get("/", test);

// router.post("/login", loginRoute);

// router.post("/signup", signupRoute);

// // to get all products data
// router.get("/getProduct", filterProduct);

// // to add productsID in usercart
// router.post("/addToCART/:userID", addToCart);

// checking if user logedin
// router.post("/isAuthenticated", isAuthenticated);
// // get product by id
// router.get("/productID/:_id", productById);

// // getting user by a user_id
// router.get("/UserDetails/:_id", getUserDetails);

// // geting user by id and updating its cart item Quentity
// router.patch("/UpdateQuantity/:_id", updateQuantity);

// // removing all items in user cart
// router.patch("/emptyCart/:_id", emptyCart);

// --------------------------------------
// Admin SignUP
router.post("/adminSignup", AdminSignupRoute);
//adminLoginRoute
router.post("/adminLogin", adminLoginRoute);

// --------------------------------------
//Buyer routes
router.post("/buyerSignup", buyerSignupRoute);
//adminLoginRoute
router.post("/buyerLogin", buyerLoginRoute);
// // to add productsID in usercart
router.post("/addToCart/:buyerId", addToCart);

//----------------------------------------
//products
router.post("/createProduct", adminAuth, createProduct);
//getAllProducts
router.get("/getAllProducts", getAllProducts);

export default router;
