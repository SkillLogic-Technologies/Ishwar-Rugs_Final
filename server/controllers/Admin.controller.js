import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

export const adminRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });


    res.status(201).json({
      success: true,
      message: "Admin Registered",
      admin 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin Register Failed",
    });
  }
};


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin Not Found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      { userId: existingAdmin._id, role: existingAdmin.role },
      process.env.SECRET_KEY,
      { expiresIn: "3d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    
    res.status(200).json({
      success: true,
      message: "Admin Logged In",
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin Login Failed",
    });
  }
};


export const getAdminProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Admin profile fetched successfully",
      admin: req.admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


export const logoutUser = async (req, res) => {
  try {
    res.cookie("userToken", "", {
      httpOnly: true,
      expires: new Date(0), // immediately expire
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
