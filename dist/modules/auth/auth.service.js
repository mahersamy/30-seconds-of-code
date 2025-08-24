"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validators = __importStar(require("./auth.validation"));
const error_response_1 = require("../../utils/response/error.response");
const email_event_1 = require("../../utils/events/email.event");
const user_model_1 = __importDefault(require("../../DB/models/user.model"));
class AuthService {
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const validationResult = validators.confirmEmailValidation.body.safeParse(req.body);
        if (!validationResult.success) {
            throw new error_response_1.BadRequestException("Validation Error", {
                issues: validationResult.error.issues,
            });
        }
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            throw new error_response_1.ApplicationException("User not found", 404);
        }
        if (user.isConfirmed) {
            throw new error_response_1.BadRequestException("Email already confirmed");
        }
        if (user.confirmOtp !== otp) {
            throw new error_response_1.BadRequestException("Invalid OTP");
        }
        await user_model_1.default.updateOne({ _id: user._id }, { $set: { isConfirmed: new Date() } });
        return res.json({ message: "Email confirmed successfully" });
    };
    signup = async (req, res) => {
        const validationResult = validators.signupValidation.body.safeParse(req.body);
        if (!validationResult.success) {
            throw new error_response_1.BadRequestException("Validation Error", {
                issues: validationResult.error.issues,
            });
        }
        const data = req.body;
        const existingUser = await user_model_1.default.findOne({ email: data.email });
        if (existingUser) {
            throw new error_response_1.ApplicationException("Email already exists", 409);
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await user_model_1.default.create({
            ...data,
            confirmOtp: otp,
        });
        email_event_1.emailEvent.emit("confirmEmail", data.email, otp);
        return res.json({ message: "Signup Success", user });
    };
    signin = async (req, res) => {
        const validationResult = validators.signinValidation.body.safeParse(req.body);
        if (!validationResult.success) {
            throw new error_response_1.BadRequestException("Validation Error", {
                issues: validationResult.error.issues,
            });
        }
        const data = req.body;
        const user = await user_model_1.default.findOne({ email: data.email });
        if (!user) {
            throw new error_response_1.ApplicationException("Invalid credentials", 401);
        }
        if (!user.isConfirmed) {
            throw new error_response_1.ApplicationException("Please confirm your email before logging in.", 403);
        }
        return res.json({ message: "Signin Success", user });
    };
}
exports.default = new AuthService();
