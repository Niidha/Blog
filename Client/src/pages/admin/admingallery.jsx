import { useState, useEffect, useRef } from "react";
import { api } from "../../axios";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import AdminLayout from "./adminnavbar";
import Sortable from "sortablejs";

export default function GalleryDashboard() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await api.get("/gallery/images");
      setImages(res.data || []); // Ensure it's sorted
    } catch (error) {
      console.error("Error fetching images", error);
      setImages([]);
    }
};


  const uploadImage = async () => {
    if (!title || !imageFile) return;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", imageFile);

      await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOpenModal(false);
      setTitle("");
      setDescription("");
      setImageFile(null);
      fetchImages();
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const deleteImage = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      fetchImages();
    } catch (error) {
      console.error("Error deleting image", error);
    }
  };

  useEffect(() => {
    if (galleryRef.current && images.length > 0) {
      const sortable = Sortable.create(galleryRef.current, {
        animation: 200,
        onEnd: async (event) => {
          if (event.oldIndex === undefined || event.newIndex === undefined) return;

          const newOrder = [...images];
          const [movedItem] = newOrder.splice(event.oldIndex, 1);
          newOrder.splice(event.newIndex, 0, movedItem);

          setImages(newOrder);

          // Send new order to backend
          const reorderedIds = newOrder.map((img) => img._id);
          try {
            await api.put("/gallery/reorder", { images: reorderedIds });
          } catch (error) {
            console.error("Error saving new order", error);
          }
        },
      });

      return () => sortable.destroy(); // Cleanup
    }
}, [images]);


  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto relative">
        <h1 className="text-3xl font-bold mb-6 text-center">Gallery Dashboard</h1>

        {/* Add Image Button */}
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 text-white px-4 py-2 mb-3 rounded-lg flex items-center hover:bg-blue-600"
        >
          <AiOutlinePlus className="mr-2" /> Add Image
        </button>

        {/* Image Upload Modal */}
        {openModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto relative">
              {/* Close Button */}
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                <AiOutlineClose size={20} />
              </button>

              <h2 className="text-lg font-bold mb-4 text-center">Add Image</h2>
              <div className="mb-6 grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="file"
                  className="border border-gray-300 p-2 rounded w-full"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                  onClick={uploadImage}
                >
                  Upload Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sortable Gallery Display */}
        <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {Array.isArray(images) &&
            images.map((img, index) =>
              img ? (
                <div key={img._id || index} className="shadow-lg rounded-lg overflow-hidden bg-white cursor-pointer">
                  <img
                    src={img.imageUrl ? `http://localhost:9090${img.imageUrl}` : "https://via.placeholder.com/150"}
                    alt={img.title || "No Title"}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-semibold text-lg">{img.title || "Untitled"}</h2>
                    <p className="text-sm text-gray-500">{img.description || "No description available"}</p>
                    <button
                      onClick={() => deleteImage(img._id)}
                      className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : null
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
