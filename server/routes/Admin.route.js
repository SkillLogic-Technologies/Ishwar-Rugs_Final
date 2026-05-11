import express from "express";
import { adminLogin, adminRegister, getAdminProfile, logoutUser } from "../controllers/Admin.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import User from "../models/User.model.js";
const routes = express.Router();

routes.post('/register', adminRegister);
routes.post('/login', adminLogin);
routes.get("/profile",isAdmin, getAdminProfile);
routes.post("/logout",isAdmin, logoutUser);

// Admin customers management
routes.get("/customers", isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

routes.delete("/customers/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default routes;