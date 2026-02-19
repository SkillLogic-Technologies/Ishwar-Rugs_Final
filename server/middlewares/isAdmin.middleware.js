import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;  // 👈 admin cookie name
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    req.admin = decoded; // future use ke liye
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
