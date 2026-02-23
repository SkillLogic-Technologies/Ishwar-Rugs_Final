import express from "express"
import { contactUs, getContacts, getContactById, updateContact, deleteContact, sendReplyController } from "../controllers/contactController.js"
import { isAuth } from "../middlewares/isAuth.middleware.js"
import { isAdmin } from "../middlewares/isAdmin.middleware.js"

const router = express.Router()

router.route("/")
.get(isAuth, isAdmin, getContacts)  
.post(contactUs)

router.route("/:id")
.get(isAuth, isAdmin, getContactById) 
.put(isAuth, isAdmin, updateContact)
.delete(isAuth, isAdmin, deleteContact) 

router.post(
  "/:id/reply",
  isAuth, isAdmin,
  sendReplyController
);  

export default router;