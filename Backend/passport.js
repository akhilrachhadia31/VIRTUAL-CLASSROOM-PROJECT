import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {User} from "./src/models/user.model.js"
import dotenv from 'dotenv';
dotenv.config({
    path : "./.env",
})
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "https://learne5.onrender.com/auth/google/callback",
            scope: ["profile","email"],
            prompt: "select_account consent",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if the user already exists in the database
                let user = await User.findOne({ email : profile.emails[0].value });

                if (!user) {
                    // Create a new user if they don't exist
                    return done(null, false, {
                        message: "User not found. Please sign up first.",
                    });
                }
                
                // Pass the user to Passport
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user,done) => {
    done(null,user);
});

passport.deserializeUser((user,done) => {
    done(null,user);
});