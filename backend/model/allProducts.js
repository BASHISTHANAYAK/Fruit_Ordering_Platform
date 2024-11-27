import mongoose from "mongoose";

const productScehma = new mongoose.Schema({
  ProdectImage: { type: String },
  // Company: { type: String },
  // Model: { type: String },
  Productprice: { type: Number },
  // ProductColor: { type: String },
  // Heaadphonetype: { type: String },
  // Productheadline: { type: String },
  // Aboutitem: { type: String },
  // ratings: { type: Number },
  // Available: { type: String },
});

const ProductModel = mongoose.model("allproducts", productScehma);
// export default ProductModel;
