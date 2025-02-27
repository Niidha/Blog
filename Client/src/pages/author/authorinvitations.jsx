import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AuthorLayout from "./authorlayout";
import { api } from "../../axios";
import toast, { Toaster } from "react-hot-toast";

function AuthorInvitations() {
  const user = useSelector((state) => state.author.user);
  const userId = user?._id;

  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchInvitations();
    }
  }, [userId]);

  const fetchInvitations = async () => {
    try {
      const response = await api.get(`/author/invitation/${userId}`);
      setInvitations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast.error(error.response?.data?.message || "Failed to fetch invitations.");
    } finally {
      setLoading(false);
    }
  };

  const respondToInvitation = async (id, action) => {
    try {
      const response = await api.post("/author/invitation/response", { id, userId, action });

      toast.success(response.data.message);

      // ✅ Optimistically remove the invitation from the UI after responding
      setInvitations((prev) => prev.filter((inv) => inv._id !== id));
    } catch (error) {
      console.error("Error responding to invitation:", error);
      toast.error(error.response?.data?.message || "Failed to respond to the invitation.");
    }
  };

  return (
    <AuthorLayout>
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Invitations</h2>

        {loading ? (
          <p>Loading invitations...</p>
        ) : invitations.length === 0 ? (
          <p className="text-gray-500">No invitations available.</p>
        ) : (
          <ul className="space-y-3">
            {invitations.map((invitation) => (
              <li key={invitation._id} className="p-3 rounded-lg shadow bg-gray-100">
                <p>{invitation.message}</p>
                <div className="mt-2 flex space-x-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    onClick={() => respondToInvitation(invitation._id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => respondToInvitation(invitation._id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthorLayout>
  );
}

export default AuthorInvitations;
