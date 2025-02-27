import React, { useEffect, useState } from "react";
import { api } from "../../axios";
import toast from "react-hot-toast";
import { FaEye, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./adminnavbar";


const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      setDashboardData(response.data.data || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
      setLoading(false);
    }
  };

  const handleViewBlog = (blogId) => {
    navigate(`/viewblog/${blogId}`);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
          Admin Dashboard
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading data...</p>
        ) : dashboardData.length === 0 ? (
          <p className="text-gray-500 text-center">No data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b text-xs md:text-sm">
                  <th className="py-2 px-2 md:px-4 border">Author</th>
                  <th className="py-2 px-2 md:px-4 border">Total Blogs</th>
                  <th className="py-2 px-2 md:px-4 border">Published</th>
                  <th className="py-2 px-2 md:px-4 border">Unpublished</th>
                  <th className="py-2 px-2 md:px-4 border">Blog List</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.map((author) => (
                  <tr key={author.authorId} className="border-b text-center text-xs md:text-sm">
                    <td className="py-2 px-2 md:px-4">{author.authorName}</td>
                    <td className="py-2 px-2 md:px-4">{author.totalBlogs ?? 0}</td>
                    <td className="py-2 px-2 md:px-4 text-green-600 font-bold">{author.publishedCount ?? 0}</td>
                    <td className="py-2 px-2 md:px-4 text-red-600 font-bold">{author.unpublishedCount ?? 0}</td>
                    <td className="py-2 px-2 md:px-4">
                      <button
                        onClick={() => setSelectedAuthor(author)}
                        className="bg-blue-500 text-white text-xs md:text-sm px-3 py-1 rounded-lg flex items-center gap-2"
                      >
                        <FaList /> Show All Blogs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Blog List Modal */}
        {selectedAuthor && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">
                Blogs by {selectedAuthor.authorName}
              </h3>
              <div className="max-h-64 overflow-y-auto">
                {selectedAuthor.blogs.length > 0 ? (
                  selectedAuthor.blogs.map((blog) => (
                    <button
                      key={blog.blogId}
                      onClick={() => handleViewBlog(blog.blogId)}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg mb-1"
                    >
                      <FaEye className="inline mr-2" />
                      {blog.title}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No blogs available.</p>
                )}
              </div>
              <button
                onClick={() => setSelectedAuthor(null)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
