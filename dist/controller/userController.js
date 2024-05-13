"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../model/user");
const mockUserId = "606cb76b9b4f5f5c60a88c3e";
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, preferences, watchHistory } = req.body;
        if (!username || !preferences || !watchHistory) {
            res.status(400).json({
                message: "Username, preferences, and watch history are required.",
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        // Create new user
        const newUser = new user_1.UserModel({
            id: mockUserId,
            username,
            password: hashedPassword,
            preferences,
            watchHistory,
        });
        // Save user to database
        const savedUser = yield newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        // Check if username and password are provided
        if (!id) {
            res.status(400).json({ message: "id required." });
            return;
        }
        // Find user by username
        const user = yield user_1.UserModel.findOne({ id });
        // If user not found
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // If username and password are correct, send success response
        res.status(200).json({ message: "Login successful.", user });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.loginUser = loginUser;
