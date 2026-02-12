import express from "express"
import { createProduct, getProducts, getProductBySlug, getProductsByCategorySlug, getProductsByCollectionSlug, updateProduct, deleteProduct, userReview } from '../controllers/productController.js'
import { upload } from "../middlewares/upload.js";
import { isAuth } from "../middlewares/isAuth.middleware.js"
import { isAdmin } from "../middlewares/isAdmin.middleware.js"
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js"
import { attachIdentity } from "../middlewares/attachIdentity.middleware.js";

const router = express.Router()

router.route("/")
.get(getProducts)
.post(isAuth, isAdmin, upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 6 }
  ]), createProduct)

router.route("/:slug").get(getProductBySlug)
router.get("/category/:slug", getProductsByCategorySlug);
router.get("/collection/:slug", getProductsByCollectionSlug);

router.route("/:id")
.put(isAuth, isAdmin, upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 6 }
  ]), updateProduct)
.delete(isAuth, isAdmin, deleteProduct)


router.route("/:id/review")
.post(optionalAuth, attachIdentity, userReview)

export default router;

