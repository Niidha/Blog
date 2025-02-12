import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

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

        // Verify token with HS256 for smaller size
        const decoded = jwt.verify(token, process.env.JWT_KEY, { algorithms: ["HS256"] });

        // Check token expiration
        if (decoded.exp && decoded.exp <= Math.floor(Date.now() / 1000)) {
            return res.status(401).json({ message: "Unauthorized. Token expired." });
        }

        // Attach only necessary user details
        // req.user = { id: decoded.sub, role: decoded.role };
        // next();
    } catch (err) {
        console.error("JWT Error:", err);
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token." });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired." });
        }
        return res.status(500).json({ message: "Internal server error." });
    }
};
