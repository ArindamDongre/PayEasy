import { JWT_SECRET } from './config.js';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Unauthorized access, token missing' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using JWT_SECRET
        const decoded = verify(token, JWT_SECRET);

        // Attach the userId to the request object
        req.userId = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
