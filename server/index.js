import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

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
import { attachGuestId } from "./middlewares/guestId.middleware.js";

const app = express();
connectDB();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(attachGuestId);
app.use(express.urlencoded({ extended: false }));

// API routes
app.use("/api/activity", activityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/user/wishlist', wishlistRoutes);
app.use('/api/user/cart', cartRoutes);
app.use('/api/contact-us', contactRoutes);
app.use('/api/admin', dashboardStatsRoutes);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend static build
const distPath = path.join(__dirname, "../dist/public");
app.use(express.static(distPath));

// SPA fallback — all non-API routes go to React
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});






