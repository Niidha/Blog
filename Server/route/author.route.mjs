import { Router } from "express";
import { deleteblog, getAllAuthors, getAuthorByUsername,  getAuthorInvitations,  getBlogByAuthor,  login, respondToInvitation, signUp, updateAuthorByUsername } from "../controller/author.controller.mjs";
import { getBlogsCountByUsername, PublishBlog,  UnpublishBlog,  updateBlog } from "../controller/post.controller.mjs";
import { Auth } from "../middleware/auth.mjs";
import { upload } from "../middleware/upload.mjs";
import { blogCollection } from "../model/post.model.mjs";
import { Notification } from "../model/notification.model.mjs";

const authorRoute = Router();

//  Author Authentication & Profile Management
authorRoute.post("/signup", signUp);
authorRoute.post("/login", login);
authorRoute.get("/details/:username", getAuthorByUsername);
authorRoute.patch("/update/:username", upload.single("image"), updateAuthorByUsername);
// authorRoute.get("/profileUrl/:userId", getauthorProfileUrl);
authorRoute.get("/", getAllAuthors);

//  Blog Management

authorRoute.put("/editblog/:id", Auth, upload.single("image"), updateBlog);
authorRoute.delete("/delete/:id", Auth, deleteblog);
authorRoute.put("/publish/:id", Auth,PublishBlog);
authorRoute.put("/submit-for-review/:blogId", async (req, res) => {
  try {
      const { blogId } = req.params;
      const blog = await blogCollection.findById(blogId).populate("author", "name");

      if (!blog) return res.status(404).json({ message: "Blog not found" });

      blog.reviewStatus = "pending";
      await blog.save();

      // ✅ Store review request as a notification for admin
      const adminNotification = new Notification({
          recipient: "admin", // Admin's fixed identifier
          message: `Blog "${blog.title}" submitted for review by ${blog.author.name}.`,
          blogId: blog._id, // Link to the blog
          type: "review_request", // Type of notification
          status: "unread", // Admin hasn't seen it yet
      });
      await adminNotification.save();

      // ✅ Emit real-time notification to admin via Socket.io
      req.app.get("io").emit("notification", {
          message: `Blog "${blog.title}" submitted for review.`,
          blogId: blog._id,
      });

      res.json({ message: "Blog submitted for review & admin notified." });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
  }
});

authorRoute.get("/invitation/:id", getAuthorInvitations);
authorRoute.post("/invitation/response", respondToInvitation);
authorRoute.put("/unpublish/:id", UnpublishBlog);
authorRoute.get("/blogcount/:username", getBlogsCountByUsername);
authorRoute.get("/:username", getBlogByAuthor);




export default authorRoute;
