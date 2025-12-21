import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import corsOptions from "./config/corsConfig.js";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use(cors(corsOptions));

app.use("/products", productRoutes);

export default app;