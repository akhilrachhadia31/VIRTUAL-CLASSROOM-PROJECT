import nodemailer from "nodemailer"
import { EMAIL_PASS, EMAIL_USER, USER_NAME } from "../constants.js";
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    socketTimeout: 30000,
    dnsTimeout: 30000,
    greetingTimeout: 30000,
    connectionTimeout: 30000,
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `${USER_NAME} <${EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
        console.log('Email sent: ', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
};


export default sendEmail;