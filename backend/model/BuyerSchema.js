



import mongoose from "mongoose";

// CartItemSchema: Represents an individual item in the cart
const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // Reference to the Product
  quantity: { type: Number, required: true, default: 1 }, // Quantity of the product in the cart
});

const BuyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // References Order IDs
  role: { type: String, default: "Buyer" }, // Default value for the role field
  cart: [CartItemSchema], // Array of Cart Items
});

export const BuyerModel = mongoose.model("Buyer", BuyerSchema);
