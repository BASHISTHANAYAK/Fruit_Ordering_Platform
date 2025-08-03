import express from "express";
import dotenv from "dotenv";
import router from "./Routes/Routes.js";
import cors from "cors";
import { connectDB } from "./db_connection/mongoo.js";

const app = express();
app.use(cors({ origin: "*" }));
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Connect to database before starting server
const startServer = async () => {
  try {
    await connectDB();
    
    app.use(router);
    
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => console.log(`App running on port ${PORT}!`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
