import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:9090");

function AuthorNotifications({ authorName }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!authorName) return;

        fetchNotifications();
        fetchUnreadCount();

        socket.emit("joinRoom", authorName);

        socket.on("newNotification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            socket.off("newNotification");
        };
    }, [authorName]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:9090/notifications/${authorName}`);
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(`http://localhost:9090/notifications/unread/${authorName}`);
            setUnreadCount(response.data.notifications.length);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:9090/notifications/read/${id}`);
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === id ? { ...notification, isRead: true } : notification
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Notifications {unreadCount > 0 && <span className="text-red-500">({unreadCount} new)</span>}
            </h2>

            {notifications.length === 0 ? (
                <p className="text-gray-500">No notifications yet.</p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((notification) => (
                        <li
                            key={notification._id}
                            className={`p-3 rounded-lg shadow cursor-pointer ${
                                notification.isRead ? "bg-gray-100" : "bg-yellow-100 font-bold"
                            }`}
                            onClick={() => markAsRead(notification._id)}
                        >
                            {notification.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AuthorNotifications;
