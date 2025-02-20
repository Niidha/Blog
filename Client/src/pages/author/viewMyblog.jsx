import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../axios";
import toast from "react-hot-toast";

function BlogsByAuthor() {
    const user = useSelector((state) => state.author.user);
    const token = useSelector((state) => state.author.token);
    const navigate = useNavigate();
    
    const username = user?.username;
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        if (!token) {
            toast.error("You must be logged in to view this page.");
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchBlogs = async () => {
            if (!username || !token) return;
            try {
                const response = await api.get(`/author/${username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBlogs(response.data);
            } catch (err) {
                setError("Error fetching blogs.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [username, token]);

    const handlePublishToggle = async (blogId) => {
        try {
            const response = await api.put(`/author/publish/${blogId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedStatus = response.data.published;

            setBlogs((prevBlogs) => 
                prevBlogs.map((blog) => 
                    blog._id === blogId ? { ...blog, published: updatedStatus } : blog
                )
            );

            toast.success(`Blog ${updatedStatus ? "Published" : "Unpublished"} successfully!`);
        } catch (error) {
            console.error("Error updating publish status:", error);
            toast.error("Failed to update publish status.");
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;

        try {
            await api.delete(`/author/delete/${confirmDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Blog deleted successfully!");
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== confirmDelete));
            setConfirmDelete(null);
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog.");
        }
    };

    if (!username) return <p className="text-center text-red-500 text-lg mt-10">User not logged in.</p>;
    if (loading) return <p className="text-center text-gray-500 text-lg mt-10">Loading blogs...</p>;
    if (error) return <p className="text-center text-red-500 text-lg mt-10">{error}</p>;

    return (
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

                                <div className="flex justify-between mt-3">
                                    <Link to={`/editblog/${blog._id}`} className="text-blue-500 hover:underline">Edit</Link>
                                    <button 
                                        onClick={() => setConfirmDelete(blog._id)} 
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <label className="flex items-center cursor-pointer mt-3">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={blog.published}
                                        onChange={() => handlePublishToggle(blog._id)}
                                    />
                                    <div
                                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ease-in-out ${
                                            blog.published ? "bg-green-500" : "bg-gray-300"
                                        }`}
                                    >
                                        <div
                                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${
                                                blog.published ? "translate-x-6" : ""
                                            }`}
                                        ></div>
                                    </div>
                                    <span className="ml-3 text-sm font-medium">
                                        {blog.published ? "Published" : "Unpublished"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-20">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this blog?</h3>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Confirm</button>
                            <button onClick={() => setConfirmDelete(null)} className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlogsByAuthor;
