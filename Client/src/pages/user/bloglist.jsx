import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function BlogList() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/blog/author/blogs")
            .then((res) => res.json())
            .then((data) => setBlogs(data))
            .catch((error) => console.error("Error fetching blogs:", error));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4">
            
            {/* Navbar with Sign Up and Login */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">All Blogs</h2>
                <div className="flex gap-4">
                    <Link to="/signup" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        Sign Up
                    </Link>
                    <Link to="/login" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                        Login
                    </Link>
                </div>
            </div>

            {blogs.length === 0 ? (
                <p className="text-gray-500 text-center">No blogs available.</p>
            ) : (
                blogs.map((blog) => (
                    <Link to={`/viewblog/${blog._id}`} key={blog._id} style={{ all: "unset" }}>
                        <div className="border-white rounded-lg p-4 mb-4 shadow-lg bg-white transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                            <div className="flex flex-col md:flex-row items-start">
                                {blog.imageUrl && (
                                    <img
                                        src={`http://localhost:8000/${blog.imageUrl}`}
                                        alt="Blog"
                                        className="w-full md:w-48 h-auto rounded-lg mb-4 md:mb-0 md:mr-4"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="text-blue-500 font-bold mb-2">{blog.category}</p>
                                    <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                                    <p className="text-gray-700 mb-4">{blog.description}</p>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <p className="italic">Author: {blog.author}</p>
                                        <p>Created At: {blog.createdAt.split("T")[0]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}

export default BlogList;
