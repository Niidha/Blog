import { Router } from "express";
import { createUser, deleteUser, getAdminDashboardData, getAdminNotifications, getAllAuthors, inviteToAdmin} from "../controller/admin.controller.mjs";
import { Notification } from "../model/notification.model.mjs";
import { respondToInvitation } from "../controller/author.controller.mjs";
import { getGeneralNotifications } from "../controller/notification.controller.mjs";
import { Auth, authorizeRoles } from "../middleware/auth.mjs";

const adminRoute=Router()
adminRoute.get('/authors',Auth,authorizeRoles("admin"), getAllAuthors);
adminRoute.get('/dashboard',Auth,authorizeRoles("admin"),  getAdminDashboardData);
adminRoute.put("/review-blog/:blogId",Auth,authorizeRoles("admin"),  async (req, res) => {
    try {
        const { blogId } = req.params;
        const { decision } = req.body;

        const blog = await blogCollection.findById(blogId);
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
adminRoute.get("/reviewnotifications",Auth,authorizeRoles("admin"),  async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: "admin"})
            .sort({ createdAt: -1 });

        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
adminRoute.get("/invitenotification",Auth,authorizeRoles("admin"),  getAdminNotifications); 
adminRoute.get("/generalnotification",Auth,authorizeRoles("admin"),  getGeneralNotifications);
adminRoute.post("/invite-admin",Auth,authorizeRoles("admin"),  inviteToAdmin); // Invite an author to be admin
adminRoute.post("/respond-invite",Auth,authorizeRoles("admin"),  respondToInvitation);
adminRoute.post("/create",Auth,authorizeRoles("admin"),  createUser); // Create a new user

adminRoute.delete("/delete/:userId",Auth,authorizeRoles("admin"),  deleteUser); 

export default adminRoute