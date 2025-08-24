"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    confirmOtp: { type: String },
    role: { type: String, enum: Object.values(user_interface_1.UserRole), default: user_interface_1.UserRole.USER },
    gender: { type: String, enum: Object.values(user_interface_1.Gender) },
    isConfirmed: { type: Date },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});
UserSchema.virtual("username")
    .get(function () {
    return `${this.firstName} ${this.lastName}`.toLowerCase();
});
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.default = UserModel;
