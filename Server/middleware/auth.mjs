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

        const decoded = jwt.verify(token, process.env.JWT_KEY, { algorithms: ["HS256"] });

        req.user = { id: decoded.sub, role: decoded.role };
        next();
    } catch (err) {
        console.error("JWT Error:", err);
        return res.status(401).json({ message: err.message });
    }
};
