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
