"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    confirmOtp: { type: String },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    gender: { type: String, enum: Object.values(Gender) },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});
UserSchema.virtual("username")
    .get(function () {
    return `${this.firstName}.${this.lastName}`.toLowerCase();
});
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.default = UserModel;
