import jwt from 'jsonwebtoken';

// Middleware to verify the token
const authMiddleware = async (req: any, res: any, next: any) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Bearer <token>

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (error, decoded) => {
        if (error) {
            res.status(401).json({ error: "Your authentication invalid." })
        } else {
            const { exp, id, role } = decoded;
            const nowTime = new Date().getTime();
            if (exp * 1000 > nowTime) {
                req.id = id;
                req.role = role;
                next();
            } else {
                res.status(401).json({ error: "Login Expired!. Please log back into the platform." })
            }
        }
    });
};

export default authMiddleware;