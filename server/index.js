import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

// 🔴 IMPORTANT: Load env vars FIRST before importing anything that needs them
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import categoryRoutes from './routes/categoryRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/Order.route.js'
import adminRoutes from './routes/Admin.route.js'
import userRoutes from './routes/User.route.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from "./routes/Payment.route.js";
import contactRoutes from './routes/contactRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import dashboardStatsRoutes from './routes/dashboardStatsRoutes.js';
import path from "path";
import { attachGuestId } from "./middlewares/guestId.middleware.js";

console.log("KEY:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);

const app = express();
// dotenv.config();
connectDB();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim())
  : ["http://localhost:5173"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use(attachGuestId);
app.use("/api/activity", activityRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/category', categoryRoutes)
app.use('/api/collection', collectionRoutes)
app.use('/api/product', productRoutes)
app.use('/api/order', orderRoutes)
app.use("/api/payment", paymentRoutes);
app.use('/api/user/wishlist', wishlistRoutes)
app.use('/api/user/cart', cartRoutes)
app.use('/api/contact-us', contactRoutes)
app.use('/api/admin', dashboardStatsRoutes)

const PORT = Number(process.env.PORT) || 5000;
const HOST = "127.0.0.1";

app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});






