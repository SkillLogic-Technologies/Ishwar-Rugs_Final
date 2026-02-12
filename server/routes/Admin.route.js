import express from "express";
import { adminLogin, getAdminProfile, logoutUser } from "../controllers/Admin.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js"; 
const routes = express.Router();


routes.post('/login', adminLogin);
routes.get("/profile",isAdmin, getAdminProfile);
routes.post("/logout",isAdmin, logoutUser);

export default routes;