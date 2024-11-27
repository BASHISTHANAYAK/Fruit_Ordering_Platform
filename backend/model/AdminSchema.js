import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // References Product IDs
  role: { type: String, default: "Admin" }, // Default value for the role field
});

export const AdminModel = mongoose.model("Admin", AdminSchema);
