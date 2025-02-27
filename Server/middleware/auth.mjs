import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const Auth = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const [type, token] = authHeader.split(" ");
        if (type !== "Bearer" || !token) {
            return res.status(401).json({ message: "Invalid token format." });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY, { algorithms: ["HS256"] });

        if (!decoded || !decoded.sub || !decoded.role) {
            return res.status(401).json({ message: "Invalid token payload." });
        }

        req.user = { id: decoded.sub, role: decoded.role };
        next();
    } catch (err) {
        console.error("JWT Error:", err);
        return res.status(401).json({ message: "Unauthorized: Token verification failed." });
    }
};

// Middleware to authorize admin users
export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
