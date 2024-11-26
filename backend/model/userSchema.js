import mongoose from "mongoose";

const userScehma = new mongoose.Schema({
  name: { type: String, required: true },
  // mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mycart: [],
});

const UserModel = mongoose.model("user", userScehma);
export default UserModel;
