import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import userRoute from './routes/User.route.js';

const app = express();

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoute);
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)

const PORT = Number(process.env.PORT) || 5000;
const HOST = "127.0.0.1";

app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});






