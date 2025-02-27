import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import AuthorLayout from "./authorlayout";
import { api } from "../../axios";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:9090");

function AuthorNotifications() {
    const user = useSelector((state) => state.author.user);
    const username = user?.username; // ✅ Ensure correct username is used
    const navigate = useNavigate();

    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!username) return; // ✅ Prevent unnecessary API calls

        fetchNotifications();
        fetchUnreadCount();

        socket.emit("joinRoom", username);

        socket.on("notification", (notification) => {
            if (notification.recipient === username) {
                setUnreadNotifications((prev) => [notification, ...prev]);
                setUnreadCount((prev) => prev + 1);
            }
        });

        return () => {
            socket.off("notification");
        };
    }, [username]);

    // ✅ Fetch notifications ONLY for the logged-in user
    const fetchNotifications = async () => {
        try {
            const response = await api.get(`/notify/${username}`);
            console.log("Fetched Notifications:", response.data);
           
            

            // ✅ Filter only the logged-in user's notifications
            const userNotifications = response.data.notifications.filter(
                (notification) => notification.recipient === username
            );

            const unread = userNotifications.filter((n) => !n.isRead);
            const read = userNotifications.filter((n) => n.isRead);

            setUnreadNotifications(unread);
            setReadNotifications(read);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setUnreadNotifications([]);
            setReadNotifications([]);
        }
    };

    // ✅ Fetch unread notification count for logged-in user
    const fetchUnreadCount = async () => {
        try {
            const response = await api.get(`/notify/unread/${username}`);
            console.log("Fetched Unread Count:", response.data);
            setUnreadCount(response.data.count || 0);
        } catch (error) {
            console.error("Error fetching unread count:", error);
            setUnreadCount(0);
        }
    };

    // ✅ Mark notification as read
    const markAsRead = async (id) => {
        try {
            await api.put(`/notify/read/${id}`);
            setUnreadNotifications((prev) => prev.filter((n) => n._id !== id));
            setReadNotifications((prev) => [
                ...prev,
                { ...unreadNotifications.find((n) => n._id === id), isRead: true },
            ]);
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <AuthorLayout>
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Your Notifications {unreadCount > 0 && <span className="text-red-500">({unreadCount} new)</span>}
                </h2>
                <button
                        onClick={() => navigate("/authorinvitation")}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                    >
                       View Invitations
                    </button>

                {unreadNotifications.length === 0 && readNotifications.length === 0 ? (
                    <p className="text-gray-500">No notifications yet.</p>
                ) : (
                    <>
                        {unreadNotifications.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-red-600 mb-2">Unread</h3>
                                <ul className="space-y-3">
                                    {unreadNotifications.map((notification) => (
                                        <li
                                            key={notification._id}
                                            className="p-3 rounded-lg shadow cursor-pointer bg-red-100 font-bold"
                                            onClick={() => markAsRead(notification._id)}
                                        >
                                            {notification.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {readNotifications.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Read</h3>
                                <ul className="space-y-3">
                                    {readNotifications.map((notification) => (
                                        <li key={notification._id} className="p-3 rounded-lg shadow bg-gray-100">
                                            {notification.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AuthorLayout>
    );
}

export default AuthorNotifications;
