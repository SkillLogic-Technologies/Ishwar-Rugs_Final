import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.userToken;;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login"
      });
    }

    const decodedData = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decodedData.userId).select("-password");

     if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
