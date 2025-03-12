import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { Gallery } from "../model/gallery.model.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads/gallery directory exists
const uploadDir = path.join(__dirname, "../uploads/gallery");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// **Multer Storage Configuration**
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });



export const getGallery = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ order: 1 }); // Sort by order field

        res.status(200).json(images);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ message: "Error fetching images", error: error.message });
    }
};


export const uploadImage = async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageUrl = req.file ? `/uploads/gallery/${req.file.filename}` : null;

        const newImage = new Gallery({ title, imageUrl, description });
        await newImage.save();

        res.status(201).json({ message: "Image uploaded successfully!", image: newImage });
    } catch (error) {
        res.status(500).json({ message: "Error uploading image", error: error.message });
    }
};

// **Delete Image**
export const deleteImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        // Remove Image File
        if (image.imageUrl) {
            const imagePath = path.join(__dirname, `../${image.imageUrl}`);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Gallery.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Image deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting image", error: error.message });
    }
};

// Export Multer Middleware
export const uploadMiddleware = upload.single("image");
