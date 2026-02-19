import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import categoryRoutes from './routes/categoryRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/User.route.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from "./routes/Admin.route.js";
import path from "path";
// import { attachGuestId } from "./middlewares/guestId.middleware.js";



const app = express();
dotenv.config();
connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
// app.use(attachGuestId);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/category', categoryRoutes)
app.use('/api/collection', collectionRoutes)
app.use('/api/product', productRoutes)
app.use('/api/user/wishlist', wishlistRoutes)
app.use('/api/user/cart', cartRoutes)
app.use('/api/contact-us', contactRoutes)

const PORT = Number(process.env.PORT) || 5000;
const HOST = "127.0.0.1";

app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});






