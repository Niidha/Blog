import React, { useEffect, useState } from "react";
import { api } from "../../axios";
import { Toaster, toast } from "react-hot-toast";
import AdminLayout from "./adminnavbar";

function AdminreviewNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/admin/invitenotification"); // Fetch admin notifications
            setNotifications(response.data.notifications);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to load notifications");
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <Toaster position="top-center" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Invitation Response</h2>
            {loading ? (
                <p>Loading notifications...</p>
            ) : notifications.length === 0 ? (
                <p className="text-gray-500">No new notifications.</p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((notification) => (
                        <li key={notification._id} className="p-3 bg-gray-100 rounded-lg shadow">
                            <p className="text-gray-800">{notification.message}</p>
                            <p className="text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </AdminLayout>
    );
}

export default AdminreviewNotifications;
