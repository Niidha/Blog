import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { api } from "../../axios";

const socket = io("http://localhost:9090"); // Change to backend URL if deployed

function AdminReview() {
    const [blogs, setBlogs] = useState([]); 
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchPendingBlogs();

        socket.on("notification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            fetchPendingBlogs();
        });

        return () => socket.off("notification");
    }, []);

    const fetchPendingBlogs = async () => {
        try {
            const response = await api.get("/admin/reviewnotifications");
            console.log("API Response:", response.data);
            
            // Fix the response handling
            setBlogs(response.data.blogs || response.data || []);
            console.log("Blogs State:", blogs); // Debugging

        } catch (error) {
            console.error("Error fetching pending blogs:", error);
            setBlogs([]);
        }
    };

    const handleDecision = async (blogId, decision) => {
        try {
            await api.put(`/review-blog/${blogId}`, { decision });
            fetchPendingBlogs();
        } catch (error) {
            console.error("Error updating blog review status:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Blog Reviews</h2>

            {/* Notification Panel */}
            {notifications.length > 0 && (
                <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
                    <h3 className="font-semibold">Notifications</h3>
                    <ul>
                        {notifications.map((notif, index) => (
                            <li key={index} className="text-sm">{notif.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Blog Review Section */}
            {blogs.length === 0 ? (
                <p className="text-gray-500">No pending reviews.</p>
            ) : (
                <ul className="space-y-4">
                    {blogs.map((blog) => (
                        <li key={blog._id} className="p-4 bg-gray-100 rounded-lg shadow">
                            <h3 className="font-semibold text-lg">{blog.title}</h3>
                            <p className="text-gray-600">{blog.content?.substring(0, 100)}...</p>
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => handleDecision(blog._id, "approve")}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDecision(blog._id, "reject")}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminReview;
