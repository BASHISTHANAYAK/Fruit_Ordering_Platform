import express from "express";
import dotenv from "dotenv";
import router from "./Routes/Routes.js";
import cors from "cors";
import "./db_connection/mongoo.js";

const app = express();
app.use(cors({ origin: "*" }));
dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(router);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(` app running on port ${PORT}!`));
