import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { api } from "../../axios";
import ReactQuill from "react-quill";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../userProvider";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const userProfileImage = localStorage.getItem("profileImage");

  useEffect(() => {
    if (user?.username) {
      setAuthor(user.username); // Set default author from logged-in user
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !author || !category || !description) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("description", description);
    if (image) formData.append("image", image);
    formData.append("published", isPublished); // ✅ Publish status included in creation

    try {
      await api.post("/get/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog created successfully!");
      navigate("/myblogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Error creating blog");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-3">
      <div className="flex justify-between">
        <Link to={`/profile`}>
          <img
            src={
              userProfileImage ||
              "https://www.iconbolt.com/preview/facebook/those-icons-glyph/user-symbol-person.svg"
            }
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
        </Link>
        <div className="m-3 flex justify-end gap-2">
          <button
            onClick={() => setIsPublished((prev) => !prev)}
            className={`px-4 py-2 rounded-lg shadow-md ${
              isPublished ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => navigate("/myblogs")}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 me-2"
          >
            View My Blogs
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700"
          >
            Log out
          </button>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6">Create Blog</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-gray-100 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Content:</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ font: [] }, { header: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["bold", "italic", "underline"],
                ["image"],
              ],
            }}
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 text-white bg-blue-900 py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Create Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
