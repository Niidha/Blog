import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";  
import { api } from "../../axios";  
import AdminLayout from "./adminnavbar";

const AuthorBlogs = () => {
  const { username } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchBlogs = async () => {
          try {
              const response = await api.get(`/author/${username}`);
              setBlogs(response.data);
          } catch (err) {
              setError("Error fetching blogs.");
          } finally {
              setLoading(false);
          }
      };
      fetchBlogs();
  }, [username]);

  if (!username) return <p className="text-center text-red-500 text-lg mt-10">User not found.</p>;
  if (loading) return <p className="text-center text-gray-500 text-lg mt-10">Loading blogs...</p>;
  if (error) return <p className="text-center text-red-500 text-lg mt-10">{error}</p>;

  return (
    <AdminLayout> {/* Ensure wrapping inside AdminLayout */}
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg mt-10">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-6 pb-5">
              Blogs by <span className="capitalize">{username}</span>
          </h1>
          {blogs.length === 0 ? (
              <p className="text-center text-gray-600">No blogs found for this author.</p>
          ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                  {blogs.map((blog) => (
                      <div 
                          key={blog._id} 
                          className="bg-gray-100 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                      >
                          <img 
                              src={`http://localhost:9090/${blog.imageUrl}`}
                              alt={blog.title} 
                              className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                              <h2 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h2>
                              <p className="text-sm text-gray-600 mb-2">Category: {blog.category || "Uncategorized"}</p>
                              <p className="text-sm text-gray-500">Created At: {blog.createdAt ? blog.createdAt.split("T")[0] : "Unknown"}</p>
                              <p className={`text-sm font-bold ${blog.published ? "text-green-500" : "text-red-500"}`}>
                                  Status: {blog.published ? "Published" : "Unpublished"}
                              </p>
                              
                              <Link
                                to={`/viewblog/${blog._id}`} 
                                className="block text-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 no-underline"
                              >
                                View
                              </Link>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </AdminLayout>
  );
};

export default AuthorBlogs;
