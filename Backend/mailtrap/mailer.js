import { google } from "googleapis";
import nodemailer from "nodemailer";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./resetpasswordrequest.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./resetpasswordsuccess.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./verificationemail.js";
import { WELCOME_EMAIL_TEMPLATE } from "./WelcomeTemplate.js";
import { configDotenv } from "dotenv";

configDotenv();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export const sendPasswordResetEmail = async (to, resetURL) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MY_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN.token,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const from = process.env.MY_EMAIL;
  const subject = "Reset Your Password";
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

  return new Promise((resolve, reject) => {
    transport.sendMail({ from, to, subject, html }, (err, info) => {
      if (err) {
        console.error("Error sending password reset email", err);
        reject(`Error sending password reset email: ${err}`);
      } else {
        resolve(info);
      }
    });
  });
};

export const sendEmail = async (to, verificationToken) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MY_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN.token,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const from = process.env.MY_EMAIL;
  const subject = "Verify Your Email Address";
  const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);

  return new Promise((resolve, reject) => {
    transport.sendMail({ from, to, subject, html }, (err, info) => {
      if (err) reject(`Error sending verification email: ${err}`);
      else resolve(info);
    });
  });
};

export const sendWelcomeEmail = async (to) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MY_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN.token,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const from = process.env.MY_EMAIL;
  const subject = "Welcome To Learnify";
  const html = WELCOME_EMAIL_TEMPLATE;

  return new Promise((resolve, reject) => {
    transport.sendMail({ from, to, subject, html }, (err, info) => {
      if (err) reject(Error sending Welcome email: ${err});
      else resolve(info);
    });
  });
};

export const sendResetSuccessEmail = async (to) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MY_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN.token,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const from = process.env.MY_EMAIL;
  const subject = "Password Reset Successful";
  const html = PASSWORD_RESET_SUCCESS_TEMPLATE;

  return new Promise((resolve, reject) => {
    transport.sendMail({ from, to, subject, html }, (err, info) => {
      if (err) {
        console.error("Error sending password reset success email", err);
        reject(Error sending password reset success email: ${err});
      } else {
        console.log("Password reset success email sent successfully", info);
        resolve(info);
      }
    });
  });
};

