import express from "express"
import { createCategory, getCategories, getCategoryBySlug, updateCategory, deleteCategory } from '../controllers/categoryController.js'
import { upload } from "../middlewares/upload.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js"

const router = express.Router();

router.route("/")
.get(getCategories)
.post(isAdmin, upload.single("image"), createCategory)

router.route("/:slug").get(getCategoryBySlug)


router.route("/:id")
.put(isAdmin, upload.single("image"), updateCategory)
.delete(isAdmin, deleteCategory)


export default router;