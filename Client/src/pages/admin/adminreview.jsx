import React, { useEffect, useState } from "react";
import { api } from "../../axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./adminnavbar";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get("/review/reviews");
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch reviews");
      setLoading(false);
    }
  };

  const handleReviewAction = async (reviewId, action) => {
    try {
      const response = await api.post(`/review/reviews/${reviewId}`, { action });
      toast.success(response.data.message);
      fetchReviews(); // Refresh list after approval/rejection
    } catch (error) {
      toast.error("Failed to update review status");
    }
  };

  const handleViewBlog = (blogId) => {
    navigate(`/viewblog/${blogId}`);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Admin Review Panel</h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-2 md:px-4 border">Blog Title</th>
                  <th className="py-2 px-2 md:px-4 border">Author</th>
                  <th className="py-2 px-2 md:px-4 border">Status</th>
                  <th className="py-2 px-2 md:px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id} className="border-b text-center">
                    <td className="py-2 px-2 md:px-4">{review.blogId?.title || "N/A"}</td>
                    <td className="py-2 px-2 md:px-4">{review.authorId?.name || "Unknown"}</td>
                    <td className="py-2 px-2 md:px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                          review.reviewStatus === "approved"
                            ? "bg-green-100 text-green-600"
                            : review.reviewStatus === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {review.reviewStatus}
                      </span>
                    </td>
                    <td className="py-2 px-2 md:px-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() => handleReviewAction(review._id, "approve")}
                          className="bg-green-500 text-white text-xs md:text-sm px-2 py-1 rounded-lg flex items-center gap-1"
                        >
                          <FaCheckCircle /> Approve
                        </button>
                        <button
                          onClick={() => handleReviewAction(review._id, "reject")}
                          className="bg-red-500 text-white text-xs md:text-sm px-2 py-1 rounded-lg flex items-center gap-1"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                        <button
                          onClick={() => handleViewBlog(review.blogId?._id)}
                          className="bg-blue-500 text-white text-xs md:text-sm px-2 py-1 rounded-lg flex items-center gap-1"
                        >
                          <FaEye /> View Blog
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
