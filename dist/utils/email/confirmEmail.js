"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmEmail = sendConfirmEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const verify_email_template_1 = require("./templates/verify.email.template");
async function sendConfirmEmail(to, otp) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Confirm your email",
        text: `Your OTP code is: ${otp}`,
        html: (0, verify_email_template_1.verifyEmailTemplate)(otp, "Email Confirmation"),
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent to:", to);
        return true;
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
        return false;
    }
}
