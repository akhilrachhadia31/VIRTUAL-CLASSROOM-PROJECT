import { User } from "../models/user.model.js";
import { otp_user } from "../models/otp-checker.js";
//import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendEmail } from "../mailtrap/mailer.js";
import { sendWelcomeEmail } from "../mailtrap/mailer.js";
import { sendPasswordResetEmail } from "../mailtrap/mailer.js";
import { sendResetSuccessEmail } from "../mailtrap/mailer.js";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import bcryptjs from 'bcryptjs'

export const signup = async (req, res) => {
	const JWT_SECRET = process.env.JWT_SECRET_KEY;
	console.log("Request Body:", req.body);
      
	const { email, password, username, type } = req.body;
      
	try {
	    // Validate required fields
	    if (!email || !password || !username || !type) {
	        throw new Error("All fields are required");
	    }
      
	    // Validate the password
	    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
	    if (!passwordRegex.test(password)) {
	        throw new Error(
		  "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be 8-12 characters long."
	        );
	    }
      
	    // Check if the email or username exists in the main User collection
	    const userExists = await User.findOne({ $or: [{ email }, { username }] });
	    if (userExists) {
	        return res
		  .status(400)
		  .json({ success: false, message: "User already exists with this email or username" });
	    }
      
	    // Check if the email or username exists in the otp_user collection (unverified users)
	    const unverifiedUserExists = await otp_user.findOne({ $or: [{ email }, { username }] });
	    if (unverifiedUserExists) {
	        // Delete the unverified user to allow the new signup to proceed
	        await otp_user.deleteOne({ _id: unverifiedUserExists._id });
	    }
      
	    // Hash the password
	    const hashedPassword = await bcryptjs.hash(password, 10);
      
	    // Generate a verification token
	    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      
	    // Create a new user in the otp_user collection
	    const newUser = new otp_user({
	        email,
	        password: hashedPassword,
	        username,
	        type,
	        verificationToken,
	        verificationTokenExpiresAt: Date.now() + 5 * 60 * 1000, // Token valid for 5 minutes
	    });
      
	    // Save the unverified user
	    await newUser.save();
      
	    // Send the verification email
	    await sendEmail(newUser.email, verificationToken);
      
	    // Generate a token for the client
	    const token = jwt.sign(
	        { userId: newUser._id, username: newUser.username },
	        JWT_SECRET,
	        { expiresIn: "1d" }
	    );
      
	    // Respond to the client
	    res.status(200).json({
	        success: true,
	        message: "User signed up successfully. Please verify your email.",
	        user: { email: newUser.email, username: newUser.username },
	        token,
	    });
	} catch (error) {
	    console.error("Error in signup:", error);
	    res.status(400).json({ success: false, message: error.message });
	}
      };
      

export const verifyEmail = async (req, res) => {
	const code = req.body.verificationToken;
	console.log(code);
	try {
		const user = await otp_user.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now()},
		});
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		const email = user.email;
		const newuser = new User({
			email: user.email,
			password : user.password,
			type:  user.type,
			username:user.username,
			classCodes: user.classCodes,
			isVerified: user.isVerified,
			verificationToken: user.verificationToken,
			verificationTokenExpiresAt : user.verificationTokenExpiresAt,
		})
		await otp_user.deleteOne({email});
		await newuser.save();

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
	const JWT_SECRET = process.env.JWT_SECRET_KEY;
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if(!user.isVerified){
			res.status(400).json({succes:false,message:"Please Verify your email"});
		}
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({user,token});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
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
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URI}/reset-password`);

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
			return res.status(400).json({ success: false, message: "User not found with this email" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		user.password = hashedPassword;

		// Validate the password
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
		if (!passwordRegex.test(password)) {
			throw new Error(
			"Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be 8-12 characters long."
			);
		}
			  

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
  

