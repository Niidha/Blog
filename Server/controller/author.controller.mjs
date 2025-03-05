import { authorCollection } from "../model/author.model.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { blogCollection } from "../model/post.model.mjs";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { Notification } from "../model/notification.model.mjs";
import dotenv from "dotenv";
dotenv.config();


export const signUp = async (req, res) => {
  try {
      const { body } = req;

      // Check if the username already exists
      const usernameCount = await authorCollection.countDocuments({ username: body.username });
      if (usernameCount > 0) {
          return res.status(409).send({ message: "Username already exists" });
      }

      // Hash password
      body.password = await bcrypt.hash(body.password, 10);

      // Default role if not provided
      body.role = body.role || "author";

      // Save user to the database
      const response = await authorCollection.create(body);

      if (!response?._id) {
          return res.status(400).send({ message: "Bad request" });
      }

      response.password = undefined; // Remove password from response

      // Assign JWT secret key based on role
      let secretKey;
      switch (response.role) {
          case "superadmin":
              secretKey = process.env.JWT_KEY_SUPERADMIN || "defaultSuperadminKey";
              break;
          case "admin":
              secretKey = process.env.JWT_KEY_ADMIN || "defaultAdminKey";
              break;
          default:
              secretKey = process.env.JWT_KEY_AUTHOR || "defaultAuthorKey";
              break;
      }

      console.log("User Role:", response.role);
      console.log("Selected Secret Key:", secretKey);

      if (!secretKey || secretKey.startsWith("default")) {
          return res.status(500).send({ message: "JWT Secret Key is missing" });
      }

      const token = jwt.sign({ sub: response._id, role: response.role }, secretKey, { expiresIn: "15d" });

      return res.status(201).send({ message: "User created!", user: response, token });
  } catch (err) {
      console.error("Signup Error:", err);
      return res.status(500).send({ message: err.message || "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
      const { username, password } = req.body;

      // Find user by username
      const user = await authorCollection.findOne({ username });

      if (!user) {
          return res.status(404).send({ message: "User not found" });
      }

      // Compare entered password with hashed password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
          return res.status(400).send({ message: "Invalid credentials" });
      }

      user.password = undefined; // Remove password from response

      // Assign JWT secret key based on role
      let secretKey;
      switch (user.role) {
          case "superadmin":
              secretKey = process.env.JWT_KEY_SUPERADMIN || "defaultSuperadminKey";
              break;
          case "admin":
              secretKey = process.env.JWT_KEY_ADMIN || "defaultAdminKey";
              break;
          default:
              secretKey = process.env.JWT_KEY_AUTHOR || "defaultAuthorKey";
              break;
      }

      console.log("User Role:", user.role);
      console.log("Selected Secret Key:", secretKey);

      if (!secretKey || secretKey.startsWith("default")) {
          return res.status(500).send({ message: "JWT Secret Key is missing" });
      }

      const token = jwt.sign({ sub: user._id, role: user.role }, secretKey, { expiresIn: "15d" });

      return res.status(200).send({ message: "User logged in", user, token });
  } catch (err) {
      console.error("Login Error:", err);
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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

export const updateAuthorByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const updatedData = req.body;

    const user = await authorCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    ["name", "email", "phone", "bio", "github", "linkedin", "instagram", "youtube"].forEach(field => {
      if (updatedData[field] !== undefined) user[field] = updatedData[field];
    });

    if (req.file) {
      const imageType = req.body.imageType || "profile";
      const folder = imageType === "profile" ? "uploads/profiles" : "uploads";
    
      if (!fs.existsSync(path.join(__dirname, folder))) {
        fs.mkdirSync(path.join(__dirname, folder), { recursive: true });
      }
    
      user.profileUrl = `${folder}/${req.file.filename}`; 
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
export const getAuthorInvitations = async (req, res) => {
  try {
      const { id } = req.params; // Get author ID from request parameters

      // Debugging: Print received ID
      console.log("Fetching invitations for recipient ID:", id);

      // Corrected Query: Match `recipient` instead of `recipientId`
      const invitations = await Notification.find({
          type: "invitation",
          recipient: id  // Ensure this matches database field
      });

      // Debugging: Print query result
      console.log("Found invitations:", invitations);

      res.status(200).json({ success: true, data: invitations });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// Handle Invitation Response




export const respondToInvitation = async (req, res) => {
  try {
    const { id, userId, action } = req.body;

    if (!id || !userId || !action) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    console.log(`Processing invitation response... User ID: ${userId}, Action: ${action}`);

    // ✅ Fetch the invitation
    const invitation = await Notification.findById(id);
    if (!invitation || invitation.type !== "invitation") {
      return res.status(404).json({ success: false, message: "Invitation not found" });
    }

    // ✅ Check if the user is the recipient
    if (invitation.recipient.toString() !== userId) {
      return res.status(403).json({ success: false, message: "User is not authorized to respond to this invitation" });
    }

    let user = await authorCollection.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let message = "";

    if (action === "accept") {
      // ✅ Promote user to admin
      user.role = "admin"; 
      await user.save();
      message = `${user.username} has accepted the admin invitation.`;

      // ✅ Notify all admins
      await Notification.create({
        recipient: "admin", // Assuming 'admin' represents all admins
        message: `${user.username} has accepted the admin invitation.`,
        type: "admin-notification",
        isRead: false,
        createdAt: new Date(),
      });

    } else if (action === "reject") {
      message = "The invitation was rejected.";

      // ✅ Notify all admins about the rejection
      await Notification.create({
        recipient: "admin", // Assuming 'admin' represents all admins
        message: `${user.username} has rejected the admin invitation.`,
        type: "admin-notification",
        isRead: false,
        createdAt: new Date(),
      });

    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    // ✅ Remove the invitation notification
    await Notification.findByIdAndDelete(id);

    console.log("Invitation processed successfully:", message);
    
    res.status(200).json({ success: true, message });

  } catch (error) {
    console.error("Error in respondToInvitation:", error);

    res.status(500).json({ 
      success: false, 
      message: "Error processing invitation", 
      error: error.message || error 
    });
  }
};
