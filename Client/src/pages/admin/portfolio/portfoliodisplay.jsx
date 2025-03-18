import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../../../axios";
import AdminLayout from "../adminnavbar";
import Navbar from "../../layouts/navbar";

const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState([]);
  const navigate = useNavigate();
  const [hover, setHover] = useState({ visible: false, x: 0, y: 0, cardId: null, disable: false });
  const [deleteModal, setDeleteModal] = useState({ show: false, portfolioId: null });

  // Get user role from Redux
  const user = useSelector((state) => state.author.user);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    api.get("/portfolio/all")
      .then(res => setPortfolios(res.data.portfolios))
      .catch(err => console.error("Error fetching portfolios:", err));
  }, []);

  // ✅ Open Delete Confirmation Modal
  const openDeleteModal = (e, portfolioId) => {
    e.stopPropagation();
    setDeleteModal({ show: true, portfolioId });
  };

  // ✅ Close Delete Modal
  const closeDeleteModal = () => {
    setDeleteModal({ show: false, portfolioId: null });
  };

  // ✅ Handle Delete Portfolio
  const handleDelete = async () => {
    if (deleteModal.portfolioId) {
      try {
        await api.delete(`/portfolio/delete/${deleteModal.portfolioId}`);
        setPortfolios((prev) => prev.filter(portfolio => portfolio._id !== deleteModal.portfolioId));
        closeDeleteModal();
      } catch (err) {
        console.error("Error deleting portfolio:", err);
      }
    }
  };

  return (
    <>
      {isAdmin ? (
        <AdminLayout>
          <PortfolioContent 
            portfolios={portfolios} 
            isAdmin={isAdmin} 
            navigate={navigate} 
            hover={hover}
            setHover={setHover}
            openDeleteModal={openDeleteModal}
          />
        </AdminLayout>
      ) : (
        <>
          <Navbar />
          <PortfolioContent 
            portfolios={portfolios} 
            isAdmin={isAdmin} 
            navigate={navigate} 
            hover={hover}
            setHover={setHover}
            openDeleteModal={openDeleteModal}
          />
        </>
      )}

      {/* ✅ Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">Do you really want to delete this portfolio?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ✅ Portfolio Content Component
const PortfolioContent = ({ portfolios, isAdmin, navigate, hover, setHover, openDeleteModal }) => {

  const handleMouseMove = (e, cardId) => {
    if (!hover.disable) { // 🚀 Prevent hover effect when on Edit/Delete
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      setHover({ visible: true, x: offsetX, y: offsetY, cardId, disable: false });
    }
  };

  const handleMouseLeave = () => {
    setHover({ visible: false, x: 0, y: 0, cardId: null, disable: false });
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Portfolios</h1>
        {isAdmin && (
          <Link to="/add" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
            Add Portfolio
          </Link>
        )}
      </div>

      {/* ✅ Portfolio Cards Grid */}
      <div className="grid grid-cols-3 gap-6 relative">
        {portfolios.map(portfolio => (
          <div
            key={portfolio._id}
            className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl group"
            onClick={() => navigate(`/portfolio/${portfolio._id}`)}
            onMouseMove={(e) => handleMouseMove(e, portfolio._id)}
            onMouseLeave={handleMouseLeave}
          >
            {/* ✅ Portfolio Image */}
            <img src={portfolio.image} alt={portfolio.title} className="w-full h-60 object-cover rounded-t-lg" />

            {/* ✅ Title & Description */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{portfolio.category}</h2>
              <p className="text-gray-600 line-clamp-2">{portfolio.title}</p>
            </div>

            {/* ✅ "View Case Study" Button that follows the cursor */}
            {hover.visible && hover.cardId === portfolio._id && !hover.disable && (
              <div 
                className="absolute pointer-events-none transition-all duration-75"
                style={{ left: `${hover.x}px`, top: `${hover.y}px`, transform: "translate(-50%, -50%)" }}
              >
                <button 
                  className="bg-black text-white px-4 py-2 rounded-lg shadow-md text-sm"
                >
                  View Case Study
                </button>
              </div>
            )}

            {/* ✅ Show Edit/Delete Buttons Only for Admins */}
            {isAdmin && (
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit/${portfolio._id}`);
                  }}
                  onMouseEnter={() => setHover(prev => ({ ...prev, disable: true }))}
                  onMouseLeave={() => setHover(prev => ({ ...prev, disable: false }))}
                  className="bg-blue-500 text-white px-3 py-2 rounded-md shadow-md text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => openDeleteModal(e, portfolio._id)}
                  onMouseEnter={() => setHover(prev => ({ ...prev, disable: true }))}
                  onMouseLeave={() => setHover(prev => ({ ...prev, disable: false }))}
                  className="bg-red-500 text-white px-3 py-2 rounded-md shadow-md text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioList;
