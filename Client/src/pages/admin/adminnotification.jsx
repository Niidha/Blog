import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { api } from "../../axios";
import AdminLayout from "./adminnavbar";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { FaExclamationTriangle } from "react-icons/fa"

const socket = io("http://localhost:9090");

function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [recipient, setRecipient] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();

        socket.on("newNotification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        return () => {
            socket.off("newNotification");
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/admin/generalnotification");
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleSend = async () => {
        if (!recipient.trim() || !message.trim()) {
            setStatus("Recipient and message are required.");
            return;
        }

        try {
            await api.post("/notify/send", {
                recipients: [recipient.trim()],
                message,
            });

            setStatus("Notification sent successfully!");
            setRecipient("");
            setMessage("");
            fetchNotifications();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error sending notification:", error);
            setStatus("Failed to send notification.");
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 relative">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Notifications</h2>

                {/* Buttons in Top-Right */}
                <div className="absolute top-6 right-6 flex space-x-3">
                    {/* Admin Review Button */}
                    <button
                        onClick={() => navigate("/adminreview")}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 flex items-center justify-center shadow-lg"
                        title="Go to Admin Review"
                    >
                        <AiOutlineCheckCircle className="w-5 h-5" />
                    </button> <button
                        onClick={() => navigate("/admininviteresponse")}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-green-600 flex items-center justify-center shadow-lg"
                        title="Go to Admin Review"
                    >
                        <FaExclamationTriangle className="w-5 h-5" />
                    </button>
                      
                    {/* Send Notification Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 flex items-center justify-center shadow-lg"
                        title="Send Notification"
                    >
                        <BiSend className="w-5 h-5" />
                    </button>
                </div>

                {/* View Notifications Section */}
                <div className="p-4 border rounded-lg bg-gray-100 mt-8">
                    <h3 className="text-lg font-semibold mb-2">All Notifications</h3>
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">No notifications found.</p>
                    ) : (
                        <ul className="space-y-3">
                            {notifications.map((notification, index) => (
                                <li key={index} className="p-3 bg-white rounded-lg shadow">
                                    <strong>To:</strong> {notification.recipient || "Unknown"} <br />
                                    <strong>Message:</strong> {notification.message} <br />
                                    <strong>Timestamp:</strong> {new Date(notification.createdAt).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Notification Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <AiOutlineClose className="w-6 h-6" />
                        </button>

                        <h3 className="text-lg font-semibold mb-2">Send Notification</h3>
                        {status && <p className="mb-3 text-sm text-red-500">{status}</p>}

                        <label className="block text-gray-700 font-semibold mb-2">Recipient (Single Author Name)</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            placeholder="e.g., JohnDoe"
                        />

                        <label className="block text-gray-700 font-semibold mb-2">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            rows="3"
                            placeholder="Enter your message..."
                        ></textarea>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                            >
                                <BiSend className="mr-2" /> Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminNotifications;
