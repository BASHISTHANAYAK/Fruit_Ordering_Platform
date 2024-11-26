import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGOODB_URL)
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((error) => {
    console.log("unable to connect mongodb ");
    console.log("mongodb error:- ", error);
  });

export default mongoose;
