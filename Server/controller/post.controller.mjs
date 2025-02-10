import { blogCollection } from '../model/post.model.mjs';
import fs from "fs";

export const createBlog = async (req, res) => {
  const { title, content, author, category, description, image } = req.body;

  let imageUrl = null;

  if (image) {
    const base64Data = image.split(',')[1];
    const filePath = `uploads/${Date.now()}.png`;
    

    try {
      fs.writeFileSync(filePath, base64Data, 'base64');
      imageUrl = filePath;
    } catch (err) {
      return res.status(500).json({ message: 'Error saving image', error: err.message });
    }
  }

  try {
    const newBlog = new blogCollection({
      title,
      content,
      author,
      category,
      description,
      imageUrl: imageUrl || '',
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog post', error: error.message });
  }
};
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


export const updateBlog= async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, author, category, imageUrl } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, description, content, author, category, imageUrl },
      { new: true }
    );

    res.status(200).json({ blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog" });
  }
}



export const getBlogsCountByUsername = async (req, res) => {
    try {
        const { username } = req.params;

      
        const count = await blogCollection.countDocuments({ author: username });

        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

