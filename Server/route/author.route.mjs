import { Router } from "express";
import { login, signUp } from "../controller/author.controller.mjs";
import { createBlog } from "../controller/post.controller.mjs";
import { blogCollection } from "../model/post.model.mjs";

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


export default authorRoute;