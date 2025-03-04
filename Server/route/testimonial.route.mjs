import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial} from "../controller/testimonials.controller.mjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testimonialRoute = express.Router();

// Multer Storage Configuration
const uploadDir = path.join(__dirname, "../uploads/testimonials");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
testimonialRoute.post("/add", upload.single("profileImage"), createTestimonial);
testimonialRoute.get("/get", getTestimonials);
testimonialRoute.put("/edit/:id", upload.single("profileImage"),updateTestimonial)
testimonialRoute.delete("/:id", deleteTestimonial);

export default testimonialRoute;
