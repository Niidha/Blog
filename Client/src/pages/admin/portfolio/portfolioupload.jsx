import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../axios";
import AdminLayout from "../adminnavbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PortfolioPost = () => {
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState({
    category: "",
    title: "",
    industry: "",
    portfolioImage: "",
    services: [{ head: "", description: "" }],
    videoUrls: [],
    imageUrls: [],
  });

  const [content, setContent] = useState("");

const handleContentChange = (value) => {
  setContent(value);
}
  const handleChange = (e) => {
    setPortfolio({ ...portfolio, [e.target.name]: e.target.value });
  };

  // Services Handlers
  const handleAddService = () => {
    setPortfolio({ ...portfolio, services: [...portfolio.services, { head: "", description: "" }] });
  };

  const handleRemoveService = (index) => {
    const updatedServices = portfolio.services.filter((_, i) => i !== index);
    setPortfolio({ ...portfolio, services: updatedServices });
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...portfolio.services];
    updatedServices[index][field] = value;
    setPortfolio({ ...portfolio, services: updatedServices });
  };

  // Video URLs Handlers
  const handleAddVideo = () => {
    setPortfolio({ ...portfolio, videoUrls: [...portfolio.videoUrls, ""] });
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = portfolio.videoUrls.filter((_, i) => i !== index);
    setPortfolio({ ...portfolio, videoUrls: updatedVideos });
  };

  const handleVideoChange = (index, value) => {
    const updatedVideos = [...portfolio.videoUrls];
    updatedVideos[index] = value;
    setPortfolio({ ...portfolio, videoUrls: updatedVideos });
  };

  // Image URLs Handlers
  const handleAddImage = () => {
    setPortfolio({ ...portfolio, imageUrls: [...portfolio.imageUrls, ""] });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = portfolio.imageUrls.filter((_, i) => i !== index);
    setPortfolio({ ...portfolio, imageUrls: updatedImages });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...portfolio.imageUrls];
    updatedImages[index] = value;
    setPortfolio({ ...portfolio, imageUrls: updatedImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
        ...portfolio,
        content: content, // Include content from Quill editor
    };

    console.log("🚀 Submitting Data:", dataToSend);

    api.post("/portfolio/add", dataToSend)
      .then(() => navigate("/portfolio"))
      .catch((err) => console.error("❌ Save error:", err));
};

  return (
    <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Add Portfolio</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="category"
          value={portfolio.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="title"
          value={portfolio.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="industry"
          value={portfolio.industry}
          onChange={handleChange}
          placeholder="Industry"
          className="border p-2 w-full"
        />

        {/* Services Section */}
        <label className="block font-semibold">Services</label>
        {portfolio.services.map((service, index) => (
          <div key={index} className="border p-3 rounded mb-2">
            <input
              type="text"
              value={service.head}
              onChange={(e) => handleServiceChange(index, "head", e.target.value)}
              placeholder="Service Title"
              className="border p-2 w-full mb-2"
            />
            <textarea
              value={service.description}
              onChange={(e) => handleServiceChange(index, "description", e.target.value)}
              placeholder="Service Description"
              className="border p-2 w-full"
            />
            <button
              type="button"
              onClick={() => handleRemoveService(index)}
              className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
            >
              Remove Service
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddService} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Service
        </button>
        <label className="block font-semibold mt-4">Content</label>
<ReactQuill
  theme="snow"
  value={content}
  onChange={handleContentChange}
  className="bg-white"
/>
        {/* Video URLs */}
        <label className="block font-semibold mt-4">Video URLs</label>
        {portfolio.videoUrls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => handleVideoChange(index, e.target.value)}
              placeholder="Enter YouTube URL"
              className="border p-2 flex-grow"
            />
            <button
              type="button"
              onClick={() => handleRemoveVideo(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddVideo} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Video
        </button>

        {/* Video Preview */}
        {portfolio.videoUrls.map((url, index) => (
          url && (
            <iframe
              key={index}
              width="100%"
              height="200"
              src={url.trim().replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")}
              title="Video Preview"
              frameBorder="0"
              allowFullScreen
              className="mt-2"
            ></iframe>
          )
        ))}

        {/* Image URLs */}
        <label className="block font-semibold mt-4">Image URLs</label>
        {portfolio.imageUrls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder="Enter Image URL"
              className="border p-2 flex-grow"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddImage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Image
        </button>

        {/* Image Preview */}
        {portfolio.imageUrls.map((url, index) => (
          url && <img key={index} src={url.trim()} alt="Preview" className="h-20 w-auto mt-2" />
        ))}

        {/* Portfolio Image */}
        <label className="block font-semibold mt-4">Portfolio Image URL</label>
        <input
          type="text"
          name="portfolioImage"
          value={portfolio.portfolioImage}
          onChange={handleChange}
          placeholder="Portfolio Image URL"
          className="border p-2 w-full"
        />

        <button type="submit" className="bg-green-500 text-white px-4 py-2 mt-4 rounded">
          Add Portfolio
        </button>
      </form>
    </div>
    </AdminLayout>
  );
};

export default PortfolioPost;
