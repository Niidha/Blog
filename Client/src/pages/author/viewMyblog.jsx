import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function BlogsByAuthor() {
    const {username} = useSelector((state) => state.user); 
   
    
    
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username) {
            setError("User not logged in.");
            setLoading(false);
            return;
        }
        

        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/blogs/author/${username}`);
                setBlogs(response.data);
            } catch (err) {
                setError("Error fetching blogs.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [username]);

    if (loading) return <p className="text-center text-gray-500 text-lg mt-10">Loading blogs...</p>;
    if (error) return <p className="text-center text-red-500 text-lg mt-10">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Blogs by {username}
            </h1>

            {blogs.length === 0 ? (
                <p className="text-center text-gray-600">No blogs found for this author.</p>
            ) : (
                <div className="space-y-6">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="p-6 bg-gray-100 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{blog.title}</h2>
                            <p className="text-sm text-gray-600 mb-2">Category: {blog.category || "Uncategorized"}</p>
                            <p className="text-gray-700">{blog.description || "No description available."}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Created At: {blog.createdAt ? blog.createdAt.split("T")[0] : "Unknown"}
                            </p>
                            <Link
                                to={`/blog/${blog._id}`}
                                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Read More
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BlogsByAuthor;
