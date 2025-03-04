import React, { useState } from "react";
import { FaBell, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authorSlice";

function AdminNavbar({ toggleSidebar }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
    };

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full h-16 z-50 shadow-md">
            <div className="flex items-center">
                <button className="text-white focus:outline-none mr-4" onClick={toggleSidebar}>
                    &#9776;
                </button>
                <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-6 relative">
                <Link to={'/adminnotification'}><FaBell/></Link>
                <div className="relative">
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="focus:outline-none">
                        <FaUser/>
                    </button>
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white shadow-md rounded-md py-2">
                            <p className="px-4 py-2 border-b">Admin</p>
                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-500">Profile</Link>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-500" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

function AdminSidebar({ isOpen, closeSidebar }) {
    return (
        <div className={`fixed top-0 left-0 h-full w-52 bg-gray-900 bg-opacity-90 text-white p-4 transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"} z-40`}>
            <button className="text-white focus:outline-none mb-4" onClick={closeSidebar}>
                ✖
            </button>
            <ul className="space-y-4">
                <li><Link to="/admindashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link></li>
                <li><Link to="/adminauthors" className="block py-2 px-4 hover:bg-gray-700 rounded">Authors</Link></li>
                <li><Link to="/adminblog" className="block py-2 px-4 hover:bg-gray-700 rounded">Blogs</Link></li>
                <li><Link to="/admingallery" className="block py-2 px-4 hover:bg-gray-700 rounded">Gallery</Link></li>
                <li><Link to="/portfolio" className="block py-2 px-4 hover:bg-gray-700 rounded">Portfolio</Link></li>
                <li><Link to="/admintestimonial" className="block py-2 px-4 hover:bg-gray-700 rounded">Testimonials</Link></li>
                <li><Link to="/adminmanage" className="block py-2 px-4 hover:bg-gray-700 rounded">Manage Users</Link></li>
             
            </ul>
        </div>
    );
}

function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="relative">
            <AdminSidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            <div className={`flex-1 min-h-screen transition-all ${isSidebarOpen ? "ml-52" : "ml-0"}`}>
                <AdminNavbar toggleSidebar={toggleSidebar} />
                <main className="p-6 pt-16">{children}</main>
            </div>
        </div>
    );
}

export default AdminLayout;
