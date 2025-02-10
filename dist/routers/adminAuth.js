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
const Admin_1 = __importDefault(require("../models/Admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adminAuthRouter = express_1.default.Router();
// Registration endpoint
adminAuthRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // Check if admin already exists
    const existingAdmin = yield Admin_1.default.findOne({ where: { email } });
    if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
    }
    // Hash the password
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    // Create a new admin
    yield Admin_1.default.create({
        name,
        email,
        password: hashedPassword,
    });
    res.status(201).json({ message: 'Admin created successfully' });
}));
// Login endpoint
adminAuthRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Find the admin by email
    const admin = yield Admin_1.default.findOne({ where: { email } });
    if (!admin) {
        return res.status(400).json({ message: 'Admin not found' });
    }
    // Compare the password
    const isMatch = yield bcryptjs_1.default.compare(password, admin.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: `${parseInt(process.env.SESSION_EXPIRED_TIME)}h` });
    // Send token in response
    res.json({ token });
}));
exports.default = adminAuthRouter;
