const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'noSleep';
const cookieParser = require('cookie-parser');

const authMiddleware = (req, res, next) => {

    // Check for the Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // // The Authorization header should be in the format "Bearer <token>"
    // const token = authHeader.split(' ')[1];

    // The Authorization header should be in the format "Bearer <token>"
    const authHeaderParts = authHeader.split(' ');

    if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    const token = authHeaderParts[1];

    console.log('authMiddleware token:', token);

    // if (!token) {
    //     return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    // }

    // const token = req.cookies.token; // Adjust this based on how you're sending the token
    // Logging to check req.cookies
    // console.log('authMiddleware token:', req.cookies);

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded; // Attach user data to the request
        next();
    } catch (ex) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
