import express from "express";
import { login,signup,logout,verifyEmail,forgotPassword, resetPassword, checkAuth} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import passport from "passport";

const router = express.Router();

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate('google', {
		successRedirect: "http://localhost:3000/home",
		failureRedirect: "login/failed",
	})
);

router.get("/check-auth",verifyToken,checkAuth)

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout", logout);

router.post("/verify-email",verifyEmail);

router.post("/forgot-password",forgotPassword);

router.post("/reset-password",resetPassword);

export default router;
