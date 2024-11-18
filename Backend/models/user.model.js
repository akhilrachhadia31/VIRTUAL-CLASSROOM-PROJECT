import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		role : 
		{
			type: String,
			required : true,
			//enum : ['Student','Teacher']
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
