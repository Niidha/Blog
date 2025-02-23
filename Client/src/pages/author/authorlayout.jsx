import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaEdit, FaList, FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:9090");

const AuthorLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const user = useSelector((state) => state.author.user);
  const username = user?.username;

  useEffect(() => {
    if (!username) return;

    fetchUnreadCount();

    // Debugging: Log when component mounts
    console.log("Component mounted, username:", username);

    socket.emit("joinRoom", username);

    socket.on("notification", (notification) => {
      console.log("New notification received:", notification);
      if (notification.recipient === username) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [username]);

  const fetchUnreadCount = async () => {
    if (!username) return;

    try {
      console.log(`Fetching unread count for: ${username}`);
      const response = await axios.get(`http://localhost:9090/blog/notify/unread/${username}`);
      
      console.log("API Response:", response.data); // Debugging log

      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-gray-800 text-white flex items-center justify-between px-6 py-3 shadow-md">
        <h1 className="text-2xl font-bold">Author Panel</h1>

        <div className="flex items-center space-x-6">
          {/* User Icon & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 text-lg focus:outline-none"
            >
              <IoPersonCircleSharp size={30} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden">
                <Link
                  to="/myblogs"
                  className="flex items-center px-4 py-2 hover:bg-gray-200"
                >
                  <FaList className="mr-2" /> View Blogs
                </Link>
                <Link
                  to="/create"
                  className="flex items-center px-4 py-2 hover:bg-gray-200"
                >
                  <FaEdit className="mr-2" /> Create Blog
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 hover:bg-gray-200"
                >
                  <FaUser className="mr-2" /> Profile
                </Link>
              </div>
            )}
          </div>

          {/* Notifications with Badge */}
          <Link to="/authornotification" className="relative">
            <FaBell size={22} className="text-lg hover:text-gray-400 transition" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Logout */}
          <button onClick={handleLogout} className="text-lg hover:text-red-400 transition">
            <FaSignOutAlt size={22} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AuthorLayout;
