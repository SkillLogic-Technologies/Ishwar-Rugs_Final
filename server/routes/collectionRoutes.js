import express from "express"
import { createCollection, getCollections, getCollectionBySlug, updateCollection, deleteCollection } from '../controllers/collectionController.js'
import { upload } from "../middlewares/upload.js";
import { isAuth } from "../middlewares/isAuth.middleware.js"
import { isAdmin } from "../middlewares/isAdmin.middleware.js"

const router = express.Router();

router.route("/")
.get(getCollections)
.post(isAuth, isAdmin, upload.single("image"), createCollection)

router.route("/:slug").get(getCollectionBySlug)

router.route("/:id")
.put(isAuth, isAdmin, upload.single("image"), updateCollection)
.delete(isAuth, isAdmin, deleteCollection)


export default router;