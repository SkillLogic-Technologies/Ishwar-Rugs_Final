import Otp from '../models/Otp.model.js';
import sendOtp from '../utils/Otp.util.js';
import User from '../models/User.model.js'
import jwt from 'jsonwebtoken'
import Cart from "../models/Cart.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Generate 6 digit OTP as STRING
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete previous OTP if exists
    await Otp.deleteMany({ email });

    // Save OTP in DB with expiry (5 minutes)
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Try to send email, but don't fail if it doesn't work
    try {
      await sendOtp({
        email,
        subject: "Login Verification Code",
        otp,
      });
    } catch (emailError) {
      console.log("Email sending failed:", emailError.message);
      // In dev, log OTP to console for testing
      if (process.env.NODE_ENV !== "production") {
        console.log(`📧 Dev Mode OTP for ${email}: ${otp}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Valid for 5 minutes.",
      // Only return OTP in dev mode for testing
      ...(process.env.NODE_ENV !== "production" && { otp }),
    });
  } catch (error) {
    console.error("Login OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};


export const verifyLoginOtp = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { username, otp } = req.body;

    if (!email || !otp || !username) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification request",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format",
      });
    }

    const existingOtp = await Otp.findOne({ email, otp });

    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: "Wrong OTP",
      });
    }

    if (existingOtp.expiresAt < new Date()) {
      await existingOtp.deleteOne();
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // 🔥 Find or Create User
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: username.trim(),
        email,
        role: "user",
      });
    }

    // 🔥 CART MERGE LOGIC START
    const guestId = req.cookies?.guestId;

    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });

      if (guestCart) {
        let userCart = await Cart.findOne({ user: user._id });

        if (userCart) {
          // 🔥 MERGE ITEMS
          guestCart.items.forEach((guestItem) => {
            const existingIndex = userCart.items.findIndex(
              (item) =>
                item.product.toString() === guestItem.product.toString()
            );

            if (existingIndex > -1) {
              userCart.items[existingIndex].quantity += guestItem.quantity;
              userCart.items[existingIndex].total =
                userCart.items[existingIndex].quantity *
                userCart.items[existingIndex].price;
            } else {
              userCart.items.push(guestItem);
            }
          });

          userCart.cartTotal = userCart.items.reduce(
            (acc, item) => acc + item.total,
            0
          );

          await userCart.save();
          await guestCart.deleteOne();

        } else {
          // Convert guest cart to user cart
          guestCart.user = user._id;
          guestCart.guestId = null;
          await guestCart.save();
        }
      }

      // Clear guest cookie after merge
      res.clearCookie("guestId");
    }
    // 🔥 CART MERGE LOGIC END

    // 🔥 Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3d" }
    );

    // 🔥 Set user cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    await existingOtp.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};


export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // fetch all users from DB
    res.json({ data: users }); // frontend format
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,      // production me true
      sameSite: "strict"
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};
