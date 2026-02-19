import express from "express"
import { toggleWishlist, getWishlist } from "../controllers/wishlistController.js"
import { attachIdentity } from "../middlewares/attachIdentity.middleware.js"
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const router = express.Router()

router.get("/", optionalAuth, attachIdentity, getWishlist)
router.post("/:productId", optionalAuth, attachIdentity, toggleWishlist);

export default router;