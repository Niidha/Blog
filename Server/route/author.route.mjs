import { Router } from "express";
import { 
    deleteblog, 
    getAllAuthors, 
    getAuthorByUsername, 
    getauthorProfileUrl, 
    getBlogByAuthor,  
    login, 
signUp, updateAuthorByUsername } from "../controller/author.controller.mjs";
import {  createBlog, getBlogsCountByUsername, PublishBlog,  updateBlog } from "../controller/post.controller.mjs";
import { blogCollection } from "../model/post.model.mjs";
import { Auth } from "../middleware/auth.mjs";
import { upload } from "../middleware/upload.mjs";

const authorRoute = Router();

//  Author Authentication & Profile Management
authorRoute.post("/signup", signUp);
authorRoute.post("/login", login);
authorRoute.get("/details/:username", getAuthorByUsername);
authorRoute.patch("/update/:username", Auth,upload.single("image"), updateAuthorByUsername);
authorRoute.get("/profileUrl/:userId", getauthorProfileUrl);
authorRoute.get("/", getAllAuthors);

//  Blog Management
authorRoute.post("/createblog", Auth, upload.single("image"), createBlog);
authorRoute.put("/editblog/:id", Auth, upload.single("image"), updateBlog);
authorRoute.delete("/delete/:id", Auth, deleteblog);
authorRoute.put("/publish/:id", Auth,PublishBlog);
authorRoute.get("/blogcount/:username", getBlogsCountByUsername);
authorRoute.get("/:username",Auth, getBlogByAuthor);
authorRoute.post("/blogs", async (req, res) => {
    try {
        const blogs = await blogCollection.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Error fetching blogs", error: error.message });
      }
});

export default authorRoute;
