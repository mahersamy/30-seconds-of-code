"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    try {
        await mongoose_1.default.connect("mongodb+srv://root:root@cluster0.k7yeieo.mongodb.net/social_media_app?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to MongoDB with Mongoose");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}
