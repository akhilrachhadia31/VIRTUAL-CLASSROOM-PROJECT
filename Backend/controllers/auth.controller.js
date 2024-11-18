import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendEmail } from "../mailtrap/mailer.js";
import { sendWelcomeEmail } from "../mailtrap/mailer.js";
import { sendPasswordResetEmail } from "../mailtrap/mailer.js";
import { sendResetSuccessEmail } from "../mailtrap/mailer.js";
import crypto from "crypto"
import bcryptjs from 'bcryptjs'

export const signup = async (req,res) => {
	console.log("Request Body:", req.body);
    const email =req.body.email;
	const password = req.body.password;
	const name = req.body.name;
	const role = req.body.role;
    try {
        if(!email || !password || !name || !role){
            throw new Error("All fields are required");
        }
            const UserAlreadyExists = await User.findOne({email});
            if(UserAlreadyExists){
                return res.status(400).json({success:false,message : "User already exists"});
            }
            const hashedPassword = await bcryptjs.hash(password,10);
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            const user = new User({
                email,
                password : hashedPassword,
                name,
				role,
                verificationToken,
                verificationTokenExpiresAt : Date.now() + 5*60*1000

            })
        await user.save();
        generateTokenAndSetCookie(res,user._id);
        await sendEmail(user.email,verificationToken);
        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user:{
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        return res.status(400).json({success:false,message : error.message});
    }
}

export const verifyEmail = async (req, res) => {
	const code = req.body.verificationToken;
	console.log(code);
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now()},
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);



		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, "http://localhost/3000/reset-password");

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		
		const { email,password } = req.body;

		const user = await User.findOne({email});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		
		const hashedPassword = await bcryptjs.hash(password, 10);
		user.password = hashedPassword;

		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
	  // Find the user by ID (excluding the password field)
	  const user = await User.findById(req.userId).select("-password");
  
	  // If user is not found, return an error
	  if (!user) {
		return res.status(400).json({ success: false, message: "User not found" });
	  }
  
	  // If user is found, return the user details inside response.data
	  return res.status(200).json({
		success: true,
		data: { user }  // Wrap the user details in the `data` field
	  });
	} catch (error) {
	  console.log("Error in checkAuth ", error);
	  res.status(400).json({ success: false, message: error.message });
	}
  };