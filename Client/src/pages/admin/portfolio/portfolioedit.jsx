import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    industry: "",
    services: [{ head: "", description: "" }],
    videoUrls: [""],
    imageUrls: [""],
    portfolioImage: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:9090/blog/portfolio/${id}`)
      .then((res) => {
        const data = res.data.portfolio;
        setFormData({
          category: data.category || "",
          title: data.title || "",
          industry: data.industry || "",
          services: data.services || [{ head: "", description: "" }],
          videoUrls: data.videoUrls || [""],
          imageUrls: data.imageUrls || [""],
          portfolioImage: data.image || "",
        });
      })
      .catch(() => toast.error("Error fetching portfolio"));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e, index, type, field = null) => {
    setFormData((prev) => {
      const updatedArray = [...prev[type]];
      if (field) {
        updatedArray[index] = { ...updatedArray[index], [field]: e.target.value };
      } else {
        updatedArray[index] = e.target.value;
      }
      return { ...prev, [type]: updatedArray };
    });
  };

  const addArrayItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], type === "services" ? { head: "", description: "" } : ""],
    }));
  };

  const removeArrayItem = (index, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:9090/blog/portfolio/update/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Portfolio updated successfully!");
      navigate(`/portfolio/${id}`);
    } catch (error) {
      toast.error("Failed to update portfolio!");
    }
  };

  return (
    <div className="p-6 w-full max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Portfolio</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded-md" required />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-md" required />
        </div>

        <div>
          <label className="block font-medium">Industry</label>
          <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label className="block font-medium">Services</label>
          {formData.services.map((service, index) => (
            <div key={index} className="mb-2 p-2 border rounded-md">
              <input type="text" placeholder="Service Head" value={service.head} onChange={(e) => handleArrayChange(e, index, "services", "head")} className="w-full p-2 border rounded-md mb-2" />
              <textarea placeholder="Service Description" value={service.description} onChange={(e) => handleArrayChange(e, index, "services", "description")} className="w-full p-2 border rounded-md"></textarea>
              <button type="button" onClick={() => removeArrayItem(index, "services")} className="px-2 bg-red-500 text-white rounded mt-2">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("services")} className="text-blue-500">+ Add Service</button>
        </div>

        <div>
          <label className="block font-medium">Video URLs</label>
          {formData.videoUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input type="text" value={url} onChange={(e) => handleArrayChange(e, index, "videoUrls")} className="w-full p-2 border rounded-md" />
              <button type="button" onClick={() => removeArrayItem(index, "videoUrls")} className="px-2 bg-red-500 text-white rounded">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("videoUrls")} className="text-blue-500">+ Add Video</button>
        </div>

        <div>
          <label className="block font-medium">Image URLs</label>
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input type="text" value={url} onChange={(e) => handleArrayChange(e, index, "imageUrls")} className="w-full p-2 border rounded-md" />
              <button type="button" onClick={() => removeArrayItem(index, "imageUrls")} className="px-2 bg-red-500 text-white rounded">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("imageUrls")} className="text-blue-500">+ Add Image URL</button>
        </div>

        <div>
          <label className="block font-medium">Portfolio Image URL</label>
          <input type="text" name="portfolioImage" value={formData.portfolioImage} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Enter image URL" />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md">Update Portfolio</button>
        </div>
      </form>
    </div>
  );
};

export default EditPortfolio;
