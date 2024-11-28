// const { default: mongoose } = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true }, // References Buyer ID
//   products: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//       }, // References Product ID
//       quantity: { type: Number, required: true }, // Quantity purchased
//     },
//   ],
//   totalPrice: { type: Number, required: true }, // Total price of the order
//   status: { type: String, default: "Pending" }, // Order status: Pending, Shipped, Delivered, etc.
//   createdAt: { type: Date, default: Date.now },
// });

// export const Order = mongoose.model("Order", OrderSchema);

// -----------------------------------------------------------------------------------------------------------------------

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    }, // References Buyer ID
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, // References Product ID
        quantity: { type: Number, required: true }, // Quantity purchased
      },
    ],
    totalPrice: { type: Number, required: true }, // Total price of the order
    status: { type: String, default: "Pending" }, // Order status: Pending, Shipped, Delivered, etc.
    createdAt: { type: Date, default: Date.now },

    // New fields for delivery details
    deliveryName: { type: String, required: true }, // Name of the person receiving the delivery
    contactInfo: { type: String, required: true }, // Contact info (e.g., phone number)
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    }, // Delivery address details (street, city, state, postal code, country)
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model("Order", OrderSchema);
