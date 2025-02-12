import { Router } from "express";
import { Auth } from "../middleware/auth.mjs";
import { upload } from "../middleware/upload.mjs";

import { blogCollection } from "../model/post.model.mjs";


const blogrouter = Router();
blogrouter.get("/blogs", async (req, res) => {
    try {
        const blogs = await blogCollection.find().populate("author", "name username");
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs" });
    }
});

// 🔹 Protected Route (Requires Auth)
blogrouter.post("/blog/create", Auth, upload.single("image"), async (req, res) => {
    try {
        const newBlog = new blogCollection({ ...req.body, author: req.user.id });
        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating blog" });
    }
});
export default blogrouter;