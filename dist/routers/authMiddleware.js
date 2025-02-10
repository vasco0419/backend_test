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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to verify the token
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            res.status(401).json({ error: "Your authentication invalid." });
        }
        else {
            const { exp, id, role } = decoded;
            const nowTime = new Date().getTime();
            if (exp * 1000 > nowTime) {
                req.id = id;
                req.role = role;
                next();
            }
            else {
                res.status(401).json({ error: "Login Expired!. Please log back into the platform." });
            }
        }
    });
});
exports.default = authMiddleware;
