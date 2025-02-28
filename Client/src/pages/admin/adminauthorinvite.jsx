import React, { useEffect, useState } from "react";
import { api } from "../../axios";
import { Toaster, toast } from "react-hot-toast";
import AdminLayout from "./adminnavbar";

function AdminreviewNotifications() {
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/admin/invitenotification");
            const allNotifications = response.data.notifications;
            setUnreadNotifications(allNotifications.filter((n) => !n.isRead));
            setReadNotifications(allNotifications.filter((n) => n.isRead));
            setUnreadCount(allNotifications.filter((n) => !n.isRead).length);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to load notifications");
            setLoading(false);
        }
    };

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
        <AdminLayout>
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
                <Toaster position="top-center" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Invitation Response</h2>
                {loading ? (
                    <p>Loading notifications...</p>
                ) : unreadNotifications.length === 0 && readNotifications.length === 0 ? (
                    <p className="text-gray-500">No new notifications.</p>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold text-gray-700 mt-4">Unread Notifications</h3>
                        <ul className="space-y-3">
                            {unreadNotifications.map((notification) => (
                                <li
                                    key={notification._id}
                                    className="p-3 bg-red-100 rounded-lg shadow cursor-pointer font-bold"
                                    onClick={() => markAsRead(notification._id)}
                                >
                                    <p className="text-gray-800">{notification.message}</p>
                                    <p className="text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                        <h3 className="text-xl font-semibold text-gray-700 mt-6">Read Notifications</h3>
                        <ul className="space-y-3">
                            {readNotifications.map((notification) => (
                                <li
                                    key={notification._id}
                                    className="p-3 bg-gray-200 rounded-lg shadow"
                                >
                                    <p className="text-gray-800">{notification.message}</p>
                                    <p className="text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminreviewNotifications;
