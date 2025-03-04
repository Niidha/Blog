import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./adminnavbar";
import { api } from "../../axios";

function AdminBlogList() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        api.get("/get/blogs")
            .then((res) => setBlogs(res.data))
            .catch((error) => console.error("Error fetching blogs:", error));
    }, []);

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto p-6 mt-16 lg:mt-20 min-h-screen relative">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Admin Blog Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.length === 0 ? (
                        <p className="text-gray-500 text-center col-span-full">No blogs available.</p>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog._id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                                {blog.imageUrl && (
                                    <img
                                        src={`http://localhost:9090/${blog.imageUrl}`}
                                        alt="Blog Cover"
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <p className="text-sm text-blue-600 font-semibold">{blog.category}</p>
                                    <h3 className="text-lg font-bold text-gray-900 mt-1">{blog.title}</h3>
                                    <p className="text-gray-700 mt-2 text-sm">
                                        {blog.description.length > 80 ? `${blog.description.slice(0, 80)}...` : blog.description}
                                    </p>

                                    {/* Published Status */}
                                    <p className="mt-3 text-sm font-semibold">
                                        Status:{" "}
                                        <span className={`px-2 py-1 rounded-full text-white text-xs ${
                                            blog.published ? "bg-green-500" : "bg-red-500"
                                        }`}>
                                            {blog.published ? "Published" : "Unpublished"}
                                        </span>
                                    </p>

                                    <div className="mt-4 flex justify-between items-center text-gray-600 text-xs">
                                        <span>Created At: {blog.createdAt.split("T")[0]}</span>
                                        <Link to={`/viewblog/${blog._id}`} className="text-blue-500 hover:underline">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminBlogList;
