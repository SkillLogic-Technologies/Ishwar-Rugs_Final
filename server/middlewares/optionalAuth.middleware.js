import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next();
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedData.userId).select("-password");

    if (user) {
      req.user = user; 
    }

    next(); 
  } catch (error) {
    next();
  }
};
