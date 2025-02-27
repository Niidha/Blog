import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../axios";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AuthorLayout from "./authorlayout";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    category: "",
    imageUrl: "",
    adminUnpublished: false, // ✅ Track if admin unpublished
    reviewStatus: "", // ✅ Track review status
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/${id}`);
        const fetchedBlog = response.data.blog;

        if (fetchedBlog) {
          setBlog({
            title: fetchedBlog.title || "",
            description: fetchedBlog.description || "",
            content: fetchedBlog.content || "",
            author: fetchedBlog.author || "",
            category: fetchedBlog.category || "",
            imageUrl: `http://localhost:9090/${fetchedBlog.imageUrl}` || "",
            adminUnpublished: fetchedBlog.adminUnpublished || false,
            reviewStatus: fetchedBlog.reviewStatus || "",
          });
        }
      } catch (error) {
        toast.error("Failed to fetch blog details");
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    console.log("Admin Unpublished:", blog.adminUnpublished);
    console.log("Review Status:", blog.reviewStatus);
  }, [blog]);

  const handleChange = (e) => {
    setBlog((prevBlog) => ({
      ...prevBlog,
      [e.target.name]: e.target.value || "",
    }));
  };

  const handleContentChange = (value) => {
    setBlog((prevBlog) => ({ ...prevBlog, content: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlog((prevBlog) => ({ ...prevBlog, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/author/editblog/${id}`, blog);
      toast.success("Blog updated successfully!");
      navigate("/myblogs");
    } catch (error) {
      toast.error("Failed to update blog");
    }
  };

  // ✅ Always allow sending for review if adminUnpublished is true
  const sendForReview = async () => {
    try {
      const response = await api.post(`/review/submit-review/${id}`);

      if (response.data.message) {
        toast.success("Blog sent for review successfully!");
        setBlog((prevBlog) => ({
          ...prevBlog,
          adminUnpublished: false, // ✅ Reset after submission
          reviewStatus: "pending", // ✅ Update review status
        }));
      } else {
        toast.error("Failed to submit for review.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error while submitting for review.");
    }
  };

  return (
    <AuthorLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">Edit Blog</h1>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Title:</label>
            <input
              type="text"
              name="title"
              value={blog.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Description:</label>
            <input
              type="text"
              name="description"
              value={blog.description}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Content:</label>
            <ReactQuill 
              value={blog.content} 
              onChange={handleContentChange}
              modules={{
                toolbar: [
                  [{ 'font': [] }, { 'header': [] }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  [{ 'align': [] }],
                  ['bold', 'italic', 'underline'],
                  ['image'],
                ],
              }}
              className="bg-white border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Category:</label>
            <input
              type="text"
              name="category"
              value={blog.category}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt="Blog Preview"
                className="w-full mt-3 h-48 object-cover rounded-md"
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="mt-5 bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Update Blog
            </button>

            {/* ✅ Always allow sending for review when adminUnpublished is true */}
            {blog.adminUnpublished && (
              <button
                onClick={sendForReview}
                type="button"
                className="mt-5 bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
              >
                Send for Review
              </button>
            )}
          </div>
        </form>
      </div>
    </AuthorLayout>
  );
};

export default EditBlog;
