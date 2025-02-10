import { Router } from "express";
import { deleteblog, getAllAuthors, getAuthorByUsername, getBlogByAuthor, login, signUp, updateAuthorByUsername } from "../controller/author.controller.mjs";
import { createBlog, getBlogsCountByUsername, updateBlog } from "../controller/post.controller.mjs";
import { blogCollection } from "../model/post.model.mjs";
import { Auth } from "../middleware/auth.mjs";

const authorRoute=Router()


authorRoute.post("/signup",signUp)
authorRoute.post("/login",login)
authorRoute.post("/createblog",createBlog)
authorRoute.get("/blogs", async (req, res) => {
    try {
        const blogs = await blogCollection.find().sort({ createdAt: -1 }); 
        res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Error fetching blogs" });
    }
});

authorRoute.get('/:username', Auth,getBlogByAuthor);

authorRoute.get('/', getAllAuthors);
authorRoute.patch('/editblog/:id', updateBlog);
authorRoute.get('/blogcount/:username', getBlogsCountByUsername);
authorRoute.get('/details/:username', getAuthorByUsername);
authorRoute.patch('/update/:username', updateAuthorByUsername);

authorRoute.delete('/delete/:id',deleteblog);

export default authorRoute;