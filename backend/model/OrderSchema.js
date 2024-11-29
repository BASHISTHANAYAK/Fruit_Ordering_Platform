import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        status: { type: String, default: "Pending" }, // Product-specific status
        admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // Admin who owns the product
      },
    ],
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    deliveryName: { type: String, required: true },
    contactInfo: { type: String, required: true },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model("Order", OrderSchema);
