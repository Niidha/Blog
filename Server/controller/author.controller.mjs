import { authorCollection } from "../model/author.model.mjs";
import bcrypt from "bcrypt";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { blogCollection } from "../model/post.model.mjs";

env.config();

export const signUp = async (req, res) => {
  try {
    const { body } = req;
    const usernameCount = await authorCollection.countDocuments({ username: body.username });
    if (usernameCount > 0) {
      return res.status(409).send({ message: "Username already Exist" });
    }
    body.password = await bcrypt.hash(body.password, 10);
    const response = await authorCollection.create(body);
    if (!response?._id) {
      return res.status(400).send({ message: "Bad request" });
    }
    response.password = null;
    const token = jwt.sign({ sub: response }, process.env.JWT_KEY, { expiresIn: "15d" });
    return res.status(201).send({ message: "User created!", user: response, token });
  } catch (err) {
    return res.status(500).send({ message: err.message || "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await authorCollection.findOne({ username });

      if (!user) {
          return res.status(404).send({ message: "User not found" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
          return res.status(400).send({ message: "Invalid credentials" });
      }

      user.password = undefined;
      const token = jwt.sign({ sub: user }, process.env.JWT_KEY, { expiresIn: "15d" });

      return res.status(200).send({ message: "User logged in", user, token });
  } catch (err) {
      return res.status(500).send({ message: err.message || "Internal server error" });
  }
};
export const getBlogByAuthor = async (req, res) => {
  try {
    const authorUsername = req.params.username
    const blog = await blogCollection.find({ author: authorUsername });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching courses for the provider',
      error: err.message
    });
  }
};


export const getAllAuthors = async (req, res) => {
    try {
        const authors = await blogCollection.distinct("author"); 

        if (authors.length === 0) {
            return res.status(404).json({ message: "No authors found" });
        }

        res.status(200).json(authors);
    } catch (error) {
        console.error("Error fetching authors:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getAuthorByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await authorCollection.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
            res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const updateAuthorByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const updatedData = req.body;
    const user = await authorCollection.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields from request body
    ["name", "email", "phone", "bio", "github", "linkedin", "instagram", "youtube"].forEach(field => {
      if (updatedData[field]) user[field] = updatedData[field];
    });

    // Handle Image Upload
    if (req.file) {
      user.profileUrl = `uploads/profiles/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteblog = async (req, res) => {
  try {
    const { id } = req.params; 

    const blog = await blogCollection.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "blog not found" });
    }

   
    await blogCollection.findByIdAndDelete(id);
    
    res.status(200).json({ message: "blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const getauthorProfileUrl = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await authorCollection.findById(userId).select("profileUrl");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ profileUrl: user.profileUrl });
    } catch (error) {
        console.error("Error fetching profile URL:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



