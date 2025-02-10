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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = require("./swagger");
const entity_1 = __importDefault(require("./entity"));
const authMiddleware_1 = __importDefault(require("./routers/authMiddleware"));
const userAuth_1 = __importDefault(require("./routers/userAuth"));
const adminAuth_1 = __importDefault(require("./routers/adminAuth"));
const router_1 = __importDefault(require("./routers/router"));
const UserController_1 = __importDefault(require("./controller/UserController"));
const AdminController_1 = __importDefault(require("./controller/AdminController"));
global._entity = new entity_1.default();
global._controller = {
    "user": new UserController_1.default(),
    "admin": new AdminController_1.default(),
};
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static('public/uploads'));
// Swagger API Docs
app.use("/api/docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
// Routes
app.use('/api/user/auth', userAuth_1.default);
app.use('/api/admin/auth', adminAuth_1.default);
//app.use('/api/', commonRouter);
app.use('/api', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, router_1.default)(req, res);
}));
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api/docs`);
});
/**
 * @swagger
 * tags:
 *   name: UserController
 *   description: User management operations
 *
 * /getUserInfo:
 *   get:
 *     summary: get user info from database
 *     description: Fetch user info from the MySQL database.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully retrieved user list.
 *
 */
