import mongoose from "mongoose";

const BuyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // References Order IDs
});

export const BuyerModel = mongoose.model("Buyer", BuyerSchema);



