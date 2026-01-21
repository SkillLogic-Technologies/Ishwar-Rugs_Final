import Otp from '../models/Otp.model.js';
import sendOtp from '../utils/Otp.util.js';
import User from '../models/User.model.js'
import jwt from 'jsonwebtoken'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginUser = async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase().trim();

         if (!email || !emailRegex.test(email)) {
          return res.status(400).json({
                success:false, 
                message:"Please enter a valid email address."
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const subject = "IshwarRugs | Secure Login Verification Code";

        const prevOtp = await Otp.findOne({email});
        if (prevOtp) {
            await prevOtp.deleteOne();
        }

        await sendOtp({
            email,
            subject,
            otp
        });

        await Otp.create({
            email,
            otp
        });

         res.status(200).json({
            success: true,
            message: "A verification code has been sent to your email. The code is valid for 5 minutes."
        });
        
    } catch (error) {
        console.error("OTP ERROR:", error);
        res.status(400).json({Success:false, message:"Verification code delivery failed. Please retry."})
    }
}
export const verifyLoginOtp = async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase().trim();
        const {username,otp} = req.body;

       if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid verification request."
        });
        }

      if (!otp || !/^\d{6}$/.test(otp)) {
        return res.status(400).json({
            success: false,
            message: "Invalid verification code."
        });
        }
        

        if (!username || username.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid name."
        });
        }

        const haveOtp = await Otp.findOne({ email, otp });
            if(!haveOtp){
            return res.status(400).json({
                success:false,
                message:"Wrong otp"
            })
        }

        let user = await User.findOne({ email });
        if (!user) {
        user = await User.create({
            username:username.trim() ,
            email,
            role: "user"
        });
        }

        const token = jwt.sign(
        { userId: user._id },
        process.env.SECRET_KEY,
        { expiresIn: "3d" }
        );
            res.cookie("token", token, {
            httpOnly: true,   
            secure: false,    
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await haveOtp.deleteOne();
        
        return res.status(200).json({
        success: true,
        message: "User loggedIn",
        user,
        token
        });
    } catch (error) {
        res.status(500).json({Success:false, message:"OTP verification failed"})
    }
}
export const myProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(user)
}
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
