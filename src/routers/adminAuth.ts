import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import dotenv from 'dotenv';

dotenv.config();
const adminAuthRouter = express.Router();

// Registration endpoint
adminAuthRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    await Admin.create({
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({ message: 'Admin created successfully' });
});

// Login endpoint
adminAuthRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Find the admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
        return res.status(400).json({ message: 'Admin not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: `${parseInt(process.env.SESSION_EXPIRED_TIME!)}h` });

    // Send token in response
    res.json({ token });
});

export default adminAuthRouter;