import env from "dotenv";
import dbConnect from "./config/db.config.mjs";
import express from "express";
import cors from "cors";
import authorRoute from "./route/author.route.mjs";
import userRoute from "./route/user.route.mjs";
import { fileURLToPath } from "url";
import path from "path";

import blogrouter from "./route/route.mjs";

env.config();


try {
    await dbConnect();
    console.log("✅ Database connected successfully.");
} catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
}

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));



app.use(cors());

// ✅ Ensure CORS Headers on All Responses
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/blog/author", authorRoute);
app.use("/blog", userRoute);
app.use("/blog/get" ,blogrouter)

// ✅ Start Server
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}...`));
