import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();
const userAuthRouter = express.Router();

// Registration endpoint
userAuthRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
        return res.status(400).send({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
    });

    res.status(201).json({ message: 'success' });
});

// Login endpoint
userAuthRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Send token in response
    res.json({ token: token, message: 'success' });
});

export default userAuthRouter;