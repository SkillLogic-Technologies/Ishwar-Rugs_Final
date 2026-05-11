import express from "express"
import { createCollection, getCollections, getCollectionBySlug, updateCollection, deleteCollection } from '../controllers/collectionController.js'
import { upload } from "../middlewares/upload.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js"

const router = express.Router();

router.route("/")
.get(getCollections)
.post(isAdmin, upload.array("image", 3), createCollection)

router.route("/:slug").get(getCollectionBySlug)

router.route("/:id")
.put(isAdmin, upload.array("image", 3), updateCollection)
.delete(isAdmin, deleteCollection)


export default router;