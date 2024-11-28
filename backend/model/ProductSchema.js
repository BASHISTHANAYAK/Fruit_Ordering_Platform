

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: {
      type: String, // URL of the product image
    },
    category: {
      type: String,
      required: true,
      enum: ["Vegetable", "Fruit"], // Restrict category to "Vegetable" or "Fruit"
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // References the Admin who added the product
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.model("Product", ProductSchema);
