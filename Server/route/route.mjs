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


blogrouter.post("/create", Auth, upload.single("image"), async (req, res) => {
    const { title, content, author, category, description } = req.body;
      let imageUrl = req.file ? `uploads/${req.file.filename}` : null; 
    
      try {
        const newBlog = new blogCollection({
          title,
          content,
          author,
          category,
          description,
          imageUrl
        });
    
        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
      } catch (error) {
        res.status(500).json({ message: "Error creating blog post", error: error.message });
      }
});

export default blogrouter;