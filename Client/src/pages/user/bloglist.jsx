import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [authors, setAuthors] = useState({});
    const fetchedAuthors = new Set();

    useEffect(() => {
        axios
            .get("http://localhost:9090/get/blogs",  {
                headers: { "Content-Type": "application/json" }
            })
            .then((res) => {
                const publishedBlogs = res.data.filter((blog) => blog.published);
                setBlogs(publishedBlogs);
            })
            .catch((error) => console.error("Error fetching blogs:", error));
    }, []);
    useEffect(() => {
        const fetchAuthors = async () => {
            const authorData = {};
            const uniqueAuthors = [...new Set(blogs.map((blog) => blog.author))];

            const fetchPromises = uniqueAuthors.map(async (authorId) => {
                if (!fetchedAuthors.has(authorId)) {
                    try {
                        const response = await fetch(`http://localhost:9090/blog/author/details/${authorId}`);
                        const data = await response.json();
                        if (!data.error) {
                            authorData[authorId] = data;
                            fetchedAuthors.add(authorId);
                        }
                    } catch (error) {
                        console.error("Error fetching author details:", error);
                    }
                }
            });

            await Promise.all(fetchPromises);
            setAuthors((prev) => ({ ...prev, ...authorData }));
        };

        if (blogs.length > 0) {
            fetchAuthors();
        }
    }, [blogs]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Published Blogs</h2>
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
                <p className="text-gray-500 text-center">No published blogs available.</p>
            ) : (
                blogs.map((blog) => (
                    <Link to={`/viewblog/${blog._id}`} key={blog._id} style={{ all: "unset" }}>
                        <div className="border-white rounded-lg p-4 mb-4 shadow-lg bg-white transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                            <div className="flex flex-col md:flex-row items-start">
                                {blog.imageUrl && (
                                    <img
                                        src={`http://localhost:9090/${blog.imageUrl}`}
                                        alt="Blog"
                                        className="w-full md:w-48 h-auto rounded-lg mb-4 md:mb-0 md:mr-4"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="text-blue-500 font-bold mb-2">{blog.category}</p>
                                    <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                                    <p className="text-gray-700 mb-4">
                                        {blog.description.length > 50 ? `${blog.description.slice(0, 50)}...` : blog.description}
                                    </p>
                                    <div className="flex justify-between items-center text-gray-600 text-sm">
                                        {authors[blog.author] ? (
                                            <Link to={`/details/${blog.author}`} className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-blue-200">
                                                <img
                                                    src={authors[blog.author].profileUrl || "https://via.placeholder.com/40"}
                                                    alt={authors[blog.author].name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <span className="text-gray-700">Author: {authors[blog.author].username}</span>
                                            </Link>
                                        ) : (
                                            <p className="text-gray-400 text-sm">Loading author...</p>
                                        )}
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
