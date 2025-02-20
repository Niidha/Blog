import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../../axios";

const socket = io("http://localhost:9090"); // WebSocket connection

function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [recipient, setRecipient] = useState(""); // Single recipient (now correctly named)
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetchNotifications();

        // Listen for real-time notifications
        socket.on("newNotification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        return () => {
            socket.off("newNotification");
        };
    }, []);

    // Fetch all notifications (Admin)
    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notify/notifications"); // ✅ Corrected API route
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Send notification
    const handleSend = async () => {
        if (!recipient.trim() || !message.trim()) {
            setStatus("Recipient and message are required.");
            return;
        }

        try {
            await api.post("/notify/send", {
                recipients: [recipient.trim()], // Convert to array since backend expects an array
                message,
            });

            setStatus("Notification sent successfully!");
            setRecipient("");
            setMessage("");

            // Fetch updated notifications
            fetchNotifications();
        } catch (error) {
            console.error("Error sending notification:", error);
            setStatus("Failed to send notification.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Notifications</h2>

            {/* Send Notification Section */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-100">
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

                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Send Notification
                </button>
            </div>

            {/* View Notifications Section */}
            <div className="p-4 border rounded-lg bg-gray-100">
                <h3 className="text-lg font-semibold mb-2">All Notifications</h3>
                {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications sent yet.</p>
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
    );
}

export default AdminNotifications;
