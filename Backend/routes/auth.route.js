import express from "express";
import { login,signup,logout,verifyEmail,forgotPassword, resetPassword, checkAuth} from "../controller/auth.controller.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"
import passport from "passport";
import "../../passport.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config({
    path : "./.env",
  })
  
const router = express.Router();

// router.get("/google", passport.authenticate("google", {scope:
// 	["profile","email"]
// }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    }),
    (req, res) => {
        const JWT_SECRET = process.env.JWT_SECRET_KEY;

        // Check if the user was not found
        if (!req.user) {
            return res.send(`
                <script>
                    alert("User not found. Please sign up first.");
                    window.opener.postMessage({ error: "User not found" }, "https://learnify-sk7g.onrender.com/login");
                    window.close();
                </script>
            `);
        }
        

        const user = req.user;
        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
            expiresIn: "1d",
        });

        // Send user and token to the parent window via postMessage
        res.send(`
            <script>
                window.opener.postMessage({
                    user: ${JSON.stringify(user)},
                    token: "${token}"
                }, "https://learnify-sk7g.onrender.com");
                window.close();
            </script>
        `);
    }
);



router.use(passport.initialize());
router.use(passport.session());

router.get("/check-auth",authenticateToken,checkAuth)

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout", logout);

router.post("/verify-email",verifyEmail);

router.post("/forgot-password",forgotPassword);

router.post("/reset-password",resetPassword);

export default router;