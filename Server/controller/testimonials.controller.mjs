import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Testimonials } from "../model/testimonials.model.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads/testimonials directory exists
const uploadDir = path.join(__dirname, "../uploads/testimonials");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// **Create a Testimonial**
export const createTestimonial = async (req, res) => {
    try {
        const { title, description, designation } = req.body;
        const profileImage = req.file ? `/uploads/testimonials/${req.file.filename}` : null;

        const newTestimonial = new Testimonials({
            title,
            description,
            designation,
            profileImage
        });

        await newTestimonial.save();
        res.status(201).json({ message: "Testimonial added successfully!", testimonial: newTestimonial });
    } catch (error) {
        res.status(500).json({ error: "Error adding testimonial", details: error.message });
    }
};

// **Get All Testimonials**
export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonials.find();
        res.status(200).json({ testimonials });
    } catch (error) {
        res.status(500).json({ error: "Error fetching testimonials", details: error.message });
    }
};
//update testimonial
export const updateTestimonial = async (req, res) => {
    try {
        console.log("Received Update Request for ID:", req.params.id);
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { title, description, designation } = req.body;
        let profileImage = req.file ? `/uploads/${req.file.filename}` : null;

        const testimonial = await Testimonials.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        if (profileImage && testimonial.profileImage) {
            const oldImagePath = path.join(__dirname, "..", "public", testimonial.profileImage);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error deleting old image:", err);
            });
        }

        testimonial.title = title;
        testimonial.description = description;
        testimonial.designation = designation;
        if (profileImage) testimonial.profileImage = profileImage;

        await testimonial.save();
        res.status(200).json({ message: "Testimonial updated successfully", testimonial });

    } catch (error) {
        console.error("Error in updateTestimonial:", error); // Log error
        res.status(500).json({ message: "Error updating testimonial", error: error.message });
    }
};


// **Delete a Testimonial**
export const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonials.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ error: "Testimonial not found" });
        }

        // Remove Image if exists
        if (testimonial.profileImage) {
            const imagePath = path.join(__dirname, `../${testimonial.profileImage}`);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Testimonials.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Testimonial deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting testimonial", details: error.message });
    }
};
