import express from "express"
import { contactUs, getContacts, getContactById, updateContact, deleteContact, sendReplyController } from "../controllers/contactController.js"
import { isAuth } from "../middlewares/isAuth.middleware.js"
import { isAdmin } from "../middlewares/isAdmin.middleware.js"

const router = express.Router()

router.route("/")
.get(isAdmin, getContacts)
.post(contactUs)

router.route("/:id")
.get(isAdmin, getContactById)
.put(isAdmin, updateContact)
.delete(isAdmin, deleteContact)

router.post(
  "/:id/reply",
  isAdmin,
  sendReplyController
);  

export default router;