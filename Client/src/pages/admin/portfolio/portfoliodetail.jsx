import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../../../axios";
import AdminLayout from "../adminnavbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../../layouts/navbar";

const PortfolioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.author.role);
  const [portfolio, setPortfolio] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    api.get(`/portfolio/${id}`)
      .then(res => {
        let data = res.data.portfolio;
        let cleanedContent = data.content?.replace(/<p><br><\/p>/g, "").trim(); // Remove empty Quill content

        setPortfolio({
          ...data,
          content: cleanedContent,
          videoUrls: Array.isArray(data.videoUrls) ? data.videoUrls : [],
          imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
          services: Array.isArray(data.services) ? data.services : [],
        });
      })
      .catch(err => console.error("Error fetching portfolio:", err));
  }, [id]);

  const handleDelete = () => {
    api.delete(`/portfolio/delete/${portfolio._id}`)
      .then(() => {
        setShowDeleteModal(false);
        navigate("/portfolio");
      })
      .catch(err => console.error("Delete error:", err));
  };

  if (!portfolio) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col mt-15">
      {/* Fix layout space issue */}
      <div className="absolute top-0 left-0 w-full">
        {userRole === "admin" ? <AdminLayout /> : <Navbar />}
      </div>

      <div className="p-6 w-full flex-grow">
        <h1 className="text-3xl font-bold mb-2">{portfolio.title}</h1>

        {portfolio.image && (
          <img src={portfolio.image} alt={portfolio.title} className="w-full max-h-96 object-contain my-4 rounded-lg shadow-lg" />
        )}

        <p className="text-gray-600 text-lg mb-4"><strong>Category:</strong> {portfolio.category}</p>

        {portfolio.industry && (
          <div className="mb-4">
            <h2 className="text-xl font-bold">Industry</h2>
            <p className="text-gray-700">{portfolio.industry}</p>
          </div>
        )}

        {portfolio.services.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Services</h2>
            <div className="w-full flex flex-col gap-2">
              {portfolio.services.map((service, index) => (
                <div key={index} className="flex justify-start w-full gap-4">
                  <h3 className="text-lg font-semibold">{service.head}:</h3>
                  <p className="text-gray-700">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ensure Quill renders only if there is valid content */}
        {portfolio.content && portfolio.content !== "" && (
         <div className="mb-6">
         <h2 className="text-xl font-bold mb-2">Content</h2>
         <div className="text-lg leading-relaxed">
           <div dangerouslySetInnerHTML={{ __html: portfolio.content }} />
         </div>
       </div>
       
        )}

        {portfolio.videoUrls.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Videos</h2>
            <div className="grid grid-cols-1 gap-4">
              {portfolio.videoUrls.map((url, index) => {
                const embedUrl = url.includes("youtu.be/")
                  ? url.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0]
                  : url.replace("watch?v=", "embed/");
                return (
                  <div key={index} className="w-full h-150">
                    <iframe src={embedUrl} className="w-full h-full rounded-lg shadow-md" frameBorder="0" allowFullScreen title={`Video ${index}`}></iframe>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {portfolio.imageUrls.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Images</h2>
            <div className="grid grid-cols-1 gap-2">
              {portfolio.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Portfolio Image ${index}`} className="w-full max-h-96 object-contain rounded-lg shadow-md" />
              ))}
            </div>
          </div>
        )}

        {userRole === "admin" && (
          <div className="flex gap-3 mt-6">
            <Link to={`/edit/${portfolio._id}`} className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md">Edit</Link>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md" onClick={() => setShowDeleteModal(true)}>Delete</button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative z-50">
              <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this portfolio?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDetail;
