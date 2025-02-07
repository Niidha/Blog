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
    const token = jwt.sign({ sub: response }, process.env.JWT_KEY, { expiresIn: "30d" });
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
      const token = jwt.sign({ sub: user }, process.env.JWT_KEY, { expiresIn: "7d" });

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

