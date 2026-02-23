import express from "express";
import { adminLogin, adminRegister, getAdminProfile, logoutUser } from "../controllers/Admin.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js"; 
const routes = express.Router();

routes.post('/register', adminRegister);
routes.post('/login', adminLogin);
routes.get("/profile",isAdmin, getAdminProfile);
routes.post("/logout",isAdmin, logoutUser);

export default routes;