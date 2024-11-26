const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true }, // References Buyer ID
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
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
