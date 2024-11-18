
import express from 'express';
import session from 'express-session';
import './passport.js';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import passport from "passport";
import cookieSession from "cookie-session";
import passportStrategy from "passport";
import { connectDB } from './db/connectDB.js';

dotenv.config();

const app = express();
app.use(session({
    secret: 'Learnify314', 
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
            "Access-Control-Allow-Origin"
          ],
        credentials: true,

    })
)


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth",authRoutes)

const PORT=process.env.PORT || 8080;



app.listen(PORT,() => {
    connectDB();
    console.log("Server is running on Port: ",PORT);
});
