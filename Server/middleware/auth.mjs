import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

export const Auth = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).send({ message: "Access denied. No token provided." });
        }

        const [type, token] = authHeader.split(" ");
        if (type !== "Bearer" || !token) {
            return res.status(401).send({ message: "Invalid token format." });
        }

        const response = jwt.verify(token, process.env.JWT_KEY);

        const currentTime = Math.floor(new Date().getTime() / 1000);
        if (response.exp <= currentTime) {
            return res.status(401).send({ message: "Unauthorized. Token expired." });
        }

        req.user = response.sub;
        next();
    } catch (err) {
        console.error(err);
        if (err.name === "JsonWebTokenError") {
            return res.status(401).send({ message: "Invalid token." });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).send({ message: "Token expired." });
        }
        return res.status(500).send({ message: "Internal server error." });
    }
};