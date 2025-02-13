import React, { useState, useEffect } from "react";
import { api } from "../../axios";
import { useSelector } from "react-redux";
import { FaTrash, FaGithub, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";

const ProfilePage = () => {
  const user = useSelector((state) => state.author.user);
  const username = user?.username || "User";

  const [profile, setProfile] = useState({});
  const [blogsCount, setBlogsCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const DEFAULT_IMAGE = "https://www.iconbolt.com/preview/facebook/those-icons-glyph/user-symbol-person.svg";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/author/details/${username}`);
        const imageUrl = response.data.profileUrl
          ? `http://localhost:9090/${response.data.profileUrl}`
          : DEFAULT_IMAGE;
        setProfile({ ...response.data, profileUrl: imageUrl });
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    const fetchBlogsCount = async () => {
      try {
        const response = await api.get(`/author/blogcount/${username}`);
        setBlogsCount(response.data.count);
      } catch (error) {
        console.error("Error fetching blogs count", error);
      }
    };

    fetchProfile();
    fetchBlogsCount();
  }, [username]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profileUrl: reader.result, imageType: "profile" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfile({ ...profile, profileUrl: DEFAULT_IMAGE });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("bio", profile.bio);
      formData.append("github", profile.github);
      formData.append("linkedin", profile.linkedin);
      formData.append("instagram", profile.instagram);
      formData.append("youtube", profile.youtube);
      formData.append("imageType", "profile");

      if (profile.profileUrl && profile.profileUrl !== DEFAULT_IMAGE) {
        const response = await fetch(profile.profileUrl);
        const blob = await response.blob();
        formData.append("image", blob, "profile-image.jpg");
      }

      await api.patch(`/author/update/${username}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center space-x-6">
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              Upload Profile
            </label>
            <img src={profile.profileUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            {profile.profileUrl !== DEFAULT_IMAGE && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                <FaTrash />
              </button>
            )}
          </div>
          <input
            type="text"
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            placeholder="Enter bio"
            className="w-full p-2 mt-4 border rounded"
          />
          <input
            type="text"
            name="github"
            value={profile.github || ""}
            onChange={handleChange}
            placeholder="GitHub URL"
            className="w-full p-2 mt-2 border rounded"
          />
          <input
            type="text"
            name="linkedin"
            value={profile.linkedin || ""}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="w-full p-2 mt-2 border rounded"
          />
          <input
            type="text"
            name="instagram"
            value={profile.instagram || ""}
            onChange={handleChange}
            placeholder="Instagram URL"
            className="w-full p-2 mt-2 border rounded"
          />
          <input
            type="text"
            name="youtube"
            value={profile.youtube || ""}
            onChange={handleChange}
            placeholder="YouTube URL"
            className="w-full p-2 mt-2 border rounded"
          />
          <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      ) : (
        <div>
          <div className="flex items-center space-x-6">
            <img
              src={profile.profileUrl || DEFAULT_IMAGE}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{username}</h2>
              <p className="text-gray-600">{profile.bio || "No bio available"}</p>
              <p className="text-gray-500">Blogs Published: {blogsCount}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-black-800">
                <FaGithub />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                <FaLinkedin />
              </a>
            )}
            {profile.instagram && (
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500">
                <FaInstagram />
              </a>
            )}
            {profile.youtube && (
              <a href={profile.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600">
                <FaYoutube />
              </a>
            )}
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
