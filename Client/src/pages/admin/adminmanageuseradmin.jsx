import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../axios";
import { FaTrash, FaUserPlus, FaTimes, FaUserEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import AdminLayout from "./adminnavbar";

export default function AdminManage() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", username: "", email: "", phone: "", password: "", role: "author" });
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [modal, setModal] = useState({ open: false, type: "", userId: null });

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        fetchNotifications();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/admin/authors");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/admin/notifications");
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    const createUser = async () => {
        if (!newUser.name || !newUser.username || !newUser.email || !newUser.phone || !newUser.password || !newUser.role) {
            toast.error("Please fill all fields.");
            return;
        }

        const validRoles = ["author", "admin"];
        if (!validRoles.includes(newUser.role)) {
            toast.error("Invalid role selected!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:9090/blog/admin/create",
                newUser,
                { headers: { "Content-Type": "application/json" } }
            );
            toast.success("User created successfully! 🎉");
            setNewUser({ name: "", username: "", email: "", phone: "", password: "", role: "author" });
            fetchUsers();
        } catch (error) {
            console.error("Error creating user:", error.response?.data || error.message);
            toast.error("Error creating user. Please try again.");
        }
    };
    const deleteUser = async () => {
        try {
            await api.delete(`/admin/delete/${modal.userId}`);
            fetchUsers();
            closeModal();
            toast.success("User deleted successfully! 🗑️");
        } catch (error) {
            console.error("Error deleting user", error);
            toast.error("Error deleting user. Please try again.");
        }
    };

    const inviteToAdmin = async () => {
        try {
            await api.post("/admin/invite-admin", { authorId: modal.userId });
            closeModal();
            toast.success("Invitation sent successfully! 📩");
        } catch (error) {
            console.error("Error sending invitation", error);
            toast.error("Error sending invitation. Please try again.");
        }
    };

    const closeModal = () => setModal({ open: false, type: "", userId: null });
    return (
    <AdminLayout>

        <div className="p-6 relative">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <button className="bg-blue-500 text-white px-4 py-2 rounded absolute top-6 right-6" onClick={() => setModal({ open: true, type: "createUser" })}><FaUserEdit/></button>

            <div className="grid gap-4 mt-12">
                {users.map(user => (
                    <div key={user._id} className="p-4 border rounded-lg flex justify-between items-center">
                        <p className="text-black">
                            <button className="text-black" style={{ textDecoration: "none" }} onClick={() => navigate(`/details/${user.name}`)}>{user.name}</button>
                        </p>
                        <div className="flex gap-2">
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center" onClick={() => setModal({ open: true, type: "invite", userId: user._id })}><FaUserPlus className="mr-2" /> Invite to Admin</button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded flex items-center" onClick={() => setModal({ open: true, type: "delete", userId: user._id })}><FaTrash className="mr-2" /> Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {modal.open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {modal.type === "createUser" ? "Create New User" : modal.type === "invite" ? "Invite to Admin" : "Delete User"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-600 hover:text-black"><FaTimes /></button>
                        </div>
                        {modal.type === "createUser" && (
                            <div className="grid grid-cols-1 gap-4">
                                <input type="text" placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="border p-2 rounded" />
                                <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="border p-2 rounded" />
                                <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="border p-2 rounded" />
                                <input type="text" placeholder="Phone Number" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="border p-2 rounded" />
                                <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="border p-2 rounded" />
                                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="border p-2 rounded">
                                    <option value="author">Author</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={createUser}>Create </button>
                            </div>
                        )}
                        {modal.type === "delete" && (
                            <>
                                <p>Are you sure you want to delete this user?</p>
                                <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={deleteUser}>Confirm</button>
                            </>
                        )}
                        {modal.type === "invite" && (
                            <>
                                <p>Do you want to invite this user to become an admin?</p>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={inviteToAdmin}>Send Invitation</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
        </AdminLayout>
    );
}
