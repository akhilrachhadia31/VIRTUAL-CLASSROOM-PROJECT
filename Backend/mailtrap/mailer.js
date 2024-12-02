import { google } from "googleapis";
import nodemailer from "nodemailer";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./resetpasswordrequest.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./resetpasswordsuccess.js";
import {VERIFICATION_EMAIL_TEMPLATE} from "./verificationemail.js"
import {WELCOME_EMAIL_TEMPLATE} from "./WelcomeTemplate.js"
import dotenv from 'dotenv';

dotenv.config({
  path : "./.env",
})

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT_URI = process.env.REDIRECT_URI;
const MY_EMAIL = process.env.MY_EMAIL;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendPasswordResetEmail = async (to, resetURL) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();``
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: MY_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const from = "learnify09@gmail.com";
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
      user: MY_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });


  const from = "learnify09@gmail.com";
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
      user: MY_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const from = "learnify09@gmail.com";
  const subject = "Welcome To Learnify";
  const html = WELCOME_EMAIL_TEMPLATE;

  return new Promise((resolve, reject) => {
    transport.sendMail({ from, to, subject, html }, (err, info) => {
      if (err) reject(`Error sending Welcome email: ${err}`);
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
      user: MY_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const from = "learnify09@gmail.com";
  const subject = "Password Reset Successful";
  const html = PASSWORD_RESET_SUCCESS_TEMPLATE;

  return new Promise((resolve, reject) => {
    transport.sendMail({ from, to, subject, html }, (err, info) => {
      if (err) {
        console.error("Error sending password reset success email", err);
        reject(`Error sending password reset success email: ${err}`);
      } else {
        console.log("Password reset success email sent successfully", info);
        resolve(info);
      }
    });
  });
};
