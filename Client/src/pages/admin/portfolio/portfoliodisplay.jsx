import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../axios";
import AdminLayout from "../adminnavbar";

const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState([]);
  const navigate = useNavigate();
  const [hover, setHover] = useState({ visible: false, x: 0, y: 0, cardId: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, portfolioId: null });

  useEffect(() => {
    api.get("/portfolio/all")
      .then(res => setPortfolios(res.data.portfolios))
      .catch(err => console.error("Error fetching portfolios:", err));
  }, []);

  const handleMouseMove = (e, cardId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Get edit/delete button position
    const editDeleteArea = rect.height - 40; // Approximate height where the buttons are

    if (offsetY > editDeleteArea) {
      setHover({ visible: false, x: 0, y: 0, cardId: null });
    } else {
      setHover({
        visible: true,
        x: offsetX,
        y: offsetY,
        cardId,
      });
    }
  };

  const handleMouseEnter = (cardId) => {
    setHover({ visible: true, x: 0, y: 0, cardId });
  };

  const handleMouseLeave = () => {
    setHover({ visible: false, x: 0, y: 0, cardId: null });
  };

  const openDeleteModal = (portfolioId) => {
    setDeleteModal({ show: true, portfolioId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, portfolioId: null });
  };

  const handleDelete = async () => {
    if (deleteModal.portfolioId) {
      try {
        await api.delete(`/portfolio/${deleteModal.portfolioId}`);
        setPortfolios(portfolios.filter(portfolio => portfolio._id !== deleteModal.portfolioId));
        closeDeleteModal();
      } catch (err) {
        console.error("Error deleting portfolio:", err);
      }
    }
  };

  return (
    <AdminLayout>
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Portfolios</h1>
        <Link to="/add" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">Add Portfolio</Link>
      </div>

      {/* Portfolio Cards Grid */}
      <div className="grid grid-cols-3 gap-6 relative">
        {portfolios.map(portfolio => (
          <div
            key={portfolio._id}
            className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl group"
            onClick={() => navigate(`/portfolio/${portfolio._id}`)}
            onMouseEnter={() => handleMouseEnter(portfolio._id)}
            onMouseMove={(e) => handleMouseMove(e, portfolio._id)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Portfolio Image */}
            <img src={portfolio.image} alt={portfolio.title} className="w-full h-60 object-cover rounded-t-lg" />

            {/* Title & Description */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{portfolio.category}</h2>
              <p className="text-gray-600">{portfolio.title}</p>
            </div>

            {/* Edit & Delete Buttons */}
            <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit/${portfolio._id}`);
                }}
                className="bg-blue-500 text-white px-3 py-2 rounded-md shadow-md text-sm hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(portfolio._id);
                }}
                className="bg-red-500 text-white px-3 py-2 rounded-md shadow-md text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {/* Moving Button - Appears Only on the Hovered Card & Not Over Edit/Delete */}
            {hover.visible && hover.cardId === portfolio._id && (
              <button
                className="absolute bg-black text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-transform duration-100 ease-out"
                style={{
                  top: hover.y,
                  left: hover.x,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
                onClick={() => navigate(`/portfolio/${hover.cardId}`)}
              >
                View Case Study
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {/* Delete Confirmation Modal */}
{deleteModal.show && (
  <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative z-50">
      <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
      <p className="text-gray-600 mb-6">Are you sure you want to delete this portfolio?</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={closeDeleteModal}
          className="px-4 py-2 bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
    </AdminLayout>
  );
};

export default PortfolioList;
