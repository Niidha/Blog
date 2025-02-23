import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import parse from "html-react-parser";
import { io } from "socket.io-client";

const socket = io("http://localhost:9090", { transports: ["websocket"] });

function ViewMyBlog() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const role = useSelector((state) => state.author.role);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState("");
    const [reason, setReason] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/blog/${id}`);
                setBlog(response.data.blog);
            } catch (err) {
                console.error("Error fetching blog details:", err);
            }
        };
        fetchBlog();
    }, [id]);

    useEffect(() => {
        if (blog?.author) {
            socket.on(`notify-${blog.author}`, (data) => {
                alert(`🔔 Notification: ${data.message}`);
            });
        }
        return () => {
            if (blog?.author) {
                socket.off(`notify-${blog.author}`);
            }
        };
    }, [blog]);

    const handleAdminAction = async () => {
        try {
            if (actionType === "unpublish" && !reason.trim()) {
                alert("Please provide a reason for marking this blog for review.");
                return;
            }

            const response = await axios.put(
                `http://localhost:9090/blog/author/unpublish/${id}`,
                { action: actionType, reason }
            );

            console.log("✅ API Response:", response);

            if (response.data.success) {
                setBlog((prevBlog) => ({
                    ...prevBlog,
                    published: actionType === "approve",
                    status: actionType === "approve" ? "Approved" : "Marked for Review",
                    adminUnpublished: actionType === "unpublish",
                }));
            }

            setShowModal(false);

            if (blog?.author) {
                console.log("📢 Sending notification to:", blog.author);

                socket.emit("notifyAuthor", {
                    username: blog.author,
                    blogTitle: blog.title,
                    reason,
                    action: actionType,
                });
            } else {
                console.warn("⚠️ No author found for blog. Skipping notification.");
            }

        } catch (err) {
            console.error("❌ Error updating blog status:", err.response?.data || err);
        }
    };

    if (!blog) return <p className="text-center text-gray-500 text-lg mt-10">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
                {blog.title || "Untitled Blog"}
            </h1>

            <div className="flex justify-between items-center text-gray-600 text-sm mb-6 border-b pb-4">
                <p className="italic p-3">Author: {blog.author || "Unknown"}</p>
                <p>Status: {blog.status}</p>
            </div>

            <p className="text-lg font-semibold text-blue-500 text-right mb-4">Category: {blog.category || "Uncategorized"}</p>

            {blog.imageUrl && (
                <div className="flex justify-center mb-6">
                    <img
                        src={`http://localhost:9090/${blog.imageUrl}`}
                        alt="Blog"
                        className="w-full max-h-[450px] object-cover rounded-lg shadow-md"
                    />
                </div>
            )}

            <p className="text-gray-700 text-lg leading-relaxed my-6 text-justify">
                {blog.description || "No description available."}
            </p>

            <div className="mt-8 border-t pt-6 space-y-6 text-gray-800 text-lg leading-relaxed">
                {blog.content ? (
                    <div className="space-y-6">
                        {parse(blog.content)}
                    </div>
                ) : (
                    <p>No content available.</p>
                )}
            </div>

            {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                <div className="mt-6">
                    <h2 className="font-bold text-gray-700 text-xl mb-2">Tags:</h2>
                    <ul className="flex flex-wrap">
                        {blog.tags.map((tag, index) => (
                            <li
                                key={index}
                                className="bg-blue-100 text-blue-700 px-3 py-1 m-1 rounded-full text-sm font-medium"
                            >
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Admin Controls */}
            {role === "admin" && (
                <div className="mt-6 flex justify-end space-x-3">
                    {blog.adminUnpublished ? (
                        <button
                            disabled
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow cursor-not-allowed"
                        >
                            Marked for Review
                        </button>
                    ) : blog.status === "Marked for Review" ? (
                        <button
                            onClick={() => {
                                setActionType("approve");
                                setShowModal(true);
                            }}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                        >
                            Approve
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setActionType("unpublish");
                                setShowModal(true);
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                        >
                            Unpublish
                        </button>
                    )}
                </div>
            )}

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            {actionType === "unpublish" ? "Confirm Mark for Review" : "Confirm Approval"}
                        </h2>
                        
                        {actionType === "unpublish" && (
                            <>
                                <p className="text-gray-600 mb-3">Enter a reason for marking this blog for review:</p>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                                    rows="3"
                                    placeholder="Enter reason..."
                                ></textarea>
                            </>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdminAction}
                                className={`px-4 py-2 rounded-lg text-white ${
                                    actionType === "unpublish"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-green-500 hover:bg-green-600"
                                }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewMyBlog;
