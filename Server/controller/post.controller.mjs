import { Notification} from '../model/notification.model.mjs';
import { blogCollection } from '../model/post.model.mjs';

export const getBlogDetails = async (req, res) => {
  try {
    const { blogId } = req.params;

  
    const blog = await blogCollection.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

   
    res.status(200).json({
      message: "Blog details fetched successfully",
      blog,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching Blog details',
      error: err.message
    });
  }
};


export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, author, category } = req.body;

    let updateFields = { title, description, content, author, category };

    if (req.file) {
      updateFields.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await blogCollection.findByIdAndUpdate(id, updateFields, { new: true });

    res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
};


export const getBlogsCountByUsername = async (req, res) => {
    try {
        const { username } = req.params;      
        const count = await blogCollection.countDocuments({ author: username });

        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




export const PublishBlog = async (req, res) => {
  try {
      const blogId = req.params.id;
      const blog = await blogCollection.findById(blogId);

      if (!blog) {
          return res.status(404).json({ message: "Blog post not found" });
      }

      // Check if the admin has restricted publishing
      if (blog.adminUnpublished && !blog.published) {
          return res.status(403).json({ 
              message: "Admin has restricted publishing. Submit for review first." 
          });
      }

      // Toggle publish status
      blog.published = !blog.published;
      await blog.save();

      res.status(200).json({ 
          message: `Blog ${blog.published ? "published" : "unpublished"} successfully`, 
          published: blog.published 
      });

  } catch (error) {
      res.status(500).json({ message: "Error updating publish status", error });
  }
};

export const UnpublishBlog = async (req, res) => {
  try {
    const { action, reason } = req.body;
    const { id } = req.params;

    console.log("Received ID:", id);

    const blog = await blogCollection.findById(id);
    console.log("Blog found:", blog);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const io = req.app.get("io");
    if (!io) {
      console.error("❌ WebSocket (io) instance is not defined");
      return res.status(500).json({ error: "WebSocket server not initialized" });
    }

    if (action === "unpublish") {
      blog.status = "Marked for Review";
      blog.published = false;
      blog.adminUnpublished = true;
      blog.reviewStatus = "pending"; // Set review status to pending
      await blog.save();

      // Notify author
      const notification = new Notification({
        recipient: blog.author.toString(),
        message: `Your blog "${blog.title}" was marked for review. Reason: ${reason}`,
      });
      await notification.save();

      io.to(blog.author.toString()).emit("notification", {
        message: `Your blog "${blog.title}" was marked for review. Reason: ${reason}`,
      });

      return res.json({ success: true, message: "Blog marked for review", blog });

    } else if (action === "approve") {
      blog.status = "Approved";
      blog.adminUnpublished = false;
      blog.reviewStatus = "approved"; // Update review status
      await blog.save();

      // Notify author
      const notification = new Notification({
        recipient: blog.author.toString(),
        message: `Your blog "${blog.title}" has been approved. You can now publish it.`,
      });
      await notification.save();

      io.to(blog.author.toString()).emit("notification", {
        message: `Your blog "${blog.title}" has been approved. You can now publish it.`,
      });

      return res.json({ success: true, message: "Blog approved", blog });

    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

  } catch (err) {
    console.error("❌ Error processing blog action:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};
