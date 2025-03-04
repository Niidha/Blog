import env from "dotenv";
import dbConnect from "./config/db.config.mjs";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authorRoute from "./route/author.route.mjs";
import userRoute from "./route/user.route.mjs";
import blogrouter from "./route/route.mjs";
import adminRoute from "./route/admin.route.mjs";
import notifyRoute from "./route/notification.route.mjs";
import { fileURLToPath } from "url";
import path from "path";
import reviewRoute from "./route/review.route.mjs";
import testimonialRoute from "./route/testimonial.route.mjs";
import GalleryRoute from "./route/gallery.route.mjs";
import PortfolioRoute from "./route/portfolio.route.mjs";

env.config();

// ✅ Connect to Database
const connectDB = async () => {
    try {
        await dbConnect();
        console.log("✅ Database connected successfully.");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};
connectDB();

// ✅ Express App Setup
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        // ✅ Ensure this matches frontend origin
        methods: ["GET", "POST", "PUT"],
        credentials: true
    }
});

// ✅ Attach io to app globally
app.set("io", io);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Properly configure CORS for Express
app.use(
    cors({
      // ✅ Ensure this matches frontend
        methods: ["GET", "POST", "PUT","DELETE","PATCH"],
        credentials: true
    })
);

// ✅ Serve static files from "uploads" directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/blog/author", authorRoute);
app.use("/blog", userRoute);
app.use("/blog/get", blogrouter);
app.use("/blog/admin", adminRoute);
app.use("/blog/notify", notifyRoute);
app.use("/blog/review", reviewRoute);
app.use("/blog/testimonial", testimonialRoute);
app.use("/blog/gallery", GalleryRoute);
app.use("/blog/portfolio", PortfolioRoute);
// ✅ WebSocket Setup
io.on("connection", (socket) => {
    console.log(`🟢 New user connected: ${socket.id}`);

    socket.on("joinRoom", (authorId) => {
        socket.join(authorId);
        console.log(`User joined room: ${authorId}`);
    });

    socket.on("notifyAuthor", ({ authorId, blogTitle, reason }) => {
        console.log(`📢 Notification sent to author ${authorId}`);
        io.to(authorId).emit("notification", {
            message: `Your blog "${blogTitle}" has been marked for review.`,
            reason: reason,
        });
    });

    socket.on("disconnect", () => {
        console.log(`🔴 User disconnected: ${socket.id}`);
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 9090;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}...`));
