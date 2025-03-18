import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md border-b-2 border-gray-200 fixed top-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-800">My Blog</h1>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
          <li><Link to="/" className="text-gray-700 hover:text-blue-500 transition">Home</Link></li>
          <li><Link to="/blogs" className="text-gray-700 hover:text-blue-500 transition">Blogs</Link></li>
          <li><Link to="/gallery" className="text-gray-700 hover:text-blue-500 transition">Gallery</Link></li>
          <li><Link to="/testimonials" className="text-gray-700 hover:text-blue-500 transition">Testimonial</Link></li>
          <li><Link to="/portfolio" className="text-gray-700 hover:text-blue-500 transition">Portfolio</Link></li>
          <li><Link to="/contact" className="text-gray-700 hover:text-blue-500 transition">Contact</Link></li>

          {/* Account Dropdown */}
          <li className="relative">
            <button 
              className="text-gray-700 hover:text-blue-500 transition" 
              onClick={() => setAccountOpen(!accountOpen)}
            >
              Account ▼
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-lg">
                <ul className="py-2 text-gray-700">
                  <li>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100">Sign Up</Link>
                  </li>
                  <li>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none text-2xl" 
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li><Link to="/" className="text-gray-700 hover:text-blue-500 transition">Home</Link></li>
            <li><Link to="/blogs" className="text-gray-700 hover:text-blue-500 transition">Blogs</Link></li>
            <li><Link to="/gallery" className="text-gray-700 hover:text-blue-500 transition">Gallery</Link></li>
            <li><Link to="/testimonials" className="text-gray-700 hover:text-blue-500 transition">Testimonial</Link></li>
            <li><Link to="/portfolio" className="text-gray-700 hover:text-blue-500 transition">Portfolio</Link></li>
            <li><Link to="/contact" className="text-gray-700 hover:text-blue-500 transition">Contact</Link></li>

            {/* Account Dropdown for Mobile */}
            <li className="relative">
              <button 
                className="text-gray-700 hover:text-blue-500 transition" 
                onClick={() => setAccountOpen(!accountOpen)}
              >
                Account ▼
              </button>
              {accountOpen && (
                <ul className="mt-2 bg-white border shadow-lg rounded-lg text-gray-700 w-40 text-center">
                  <li>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100">Sign Up</Link>
                  </li>
                  <li>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
