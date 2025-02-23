import { Router } from "express";
import { getAllAuthors } from "../controller/admin.controller.mjs";
import { Notification } from "../model/notification.model.mjs";

const adminRoute=Router()
adminRoute.get('/authors', getAllAuthors);
adminRoute.put("/review-blog/:blogId", async (req, res) => {
    try {
        const { blogId } = req.params;
        const { decision } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if (decision === "approve") {
            blog.reviewStatus = "approved";
            blog.adminUnpublished = false;
            blog.published = false;
            await blog.save();

            const notification = new Notification({
                recipient: blog.author.toString(),
                message: `Your blog \"${blog.title}\" has been approved. You can now publish it.`,
            });
            await notification.save();

            req.app.get("io").to(blog.author.toString()).emit("notification", {
                message: `Your blog \"${blog.title}\" has been approved. You can now publish it.`,
            });

            return res.json({ message: "Blog approved successfully.", blog });
        } else if (decision === "reject") {
            blog.reviewStatus = "rejected";
            await blog.save();

            const notification = new Notification({
                recipient: blog.author.toString(),
                message: `Your blog \"${blog.title}\" has been rejected by the admin.`,
            });
            await notification.save();

            req.app.get("io").to(blog.author.toString()).emit("notification", {
                message: `Your blog \"${blog.title}\" has been rejected by the admin.`,
            });

            return res.json({ message: "Blog rejected.", blog });
        } else {
            return res.status(400).json({ error: "Invalid decision" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
adminRoute.get("/reviewnotifications", async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: "admin"})
            .sort({ createdAt: -1 });

        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default adminRoute