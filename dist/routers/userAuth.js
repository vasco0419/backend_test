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
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userAuthRouter = express_1.default.Router();
// Registration endpoint
userAuthRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // Check if user already exists
    const existingUser = yield User_1.default.findOne({ where: { email: email } });
    if (existingUser) {
        return res.status(400).send({ message: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    // Create a new user
    const user = yield User_1.default.create({
        name: name,
        email: email,
        password: hashedPassword,
    });
    res.status(201).json({ message: 'success' });
}));
// Login endpoint
userAuthRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Find the user by email
    const user = yield User_1.default.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    // Compare the password
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Send token in response
    res.json({ token: token, message: 'success' });
}));
exports.default = userAuthRouter;
