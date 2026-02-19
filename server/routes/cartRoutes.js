import express from "express";
import { addToCart, updateQuantity, removeFromCart, getCart } from "../controllers/cartController.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";
import { attachIdentity } from "../middlewares/attachIdentity.middleware.js";

const router = express.Router();

router.get("/", optionalAuth, attachIdentity, getCart);
router.post("/:productId", optionalAuth, attachIdentity, addToCart);
router.put("/update-quantity", optionalAuth, attachIdentity, updateQuantity);
router.delete("/remove-item", optionalAuth, attachIdentity, removeFromCart);

export default router;
