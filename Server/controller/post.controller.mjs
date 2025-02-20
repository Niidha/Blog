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




export const PublishBlog=async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await blogCollection.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

      
        blog.published = !blog.published;
        await blog.save();

        res.status(200).json({ message: "Publish status updated", published: blog.published });
    } catch (error) {
        res.status(500).json({ message: "Error updating publish status", error });
    }
}
export const UnpublishBlog = async (req, res) => {
  try {
    const { reason } = req.body;
    const blog = await blogCollection.findById(req.params.id);

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Update status to 'Marked for Review' and set published to false
    blog.status = "Marked for Review";
    blog.published = false;
    await blog.save();

    // Store notification in the database
    const notification = new Notification({
      username: blog.author, // Assuming 'author' is the username
      message: `Your blog "${blog.title}" was marked for review. Reason: ${reason}`,
    });
    await notification.save();

    // Send notification via Socket.IO
    req.io.emit(`notify-${blog.author}`, {
      message: `Your blog "${blog.title}" was marked for review. Reason: ${reason}`,
    });

    res.json({ success: true, message: "Blog marked for review", blog });
  } catch (err) {
    console.error("Error unpublishing blog:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



