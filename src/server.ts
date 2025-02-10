import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { swaggerUi, swaggerSpec } from "./swagger";
import Entity from "./entity";
import authMiddleware from "./routers/authMiddleware";
import userAuthRouter from "./routers/userAuth";
import adminAuthRouter from "./routers/adminAuth";
import router from "./routers/router";

import UserController from "./controller/UserController";
import AdminController from "./controller/AdminController";



global._entity = new Entity();
global._controller = {
    "user": new UserController(),
    "admin": new AdminController(),
}

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));

// Swagger API Docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/user/auth', userAuthRouter);
app.use('/api/admin/auth', adminAuthRouter);
//app.use('/api/', commonRouter);
app.use('/api', authMiddleware, async (req: Request, res: Response) => {
    await router(req, res);
});


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
