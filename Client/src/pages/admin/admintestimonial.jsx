import React, { useState, useEffect } from "react";
import { api } from "../../axios";
import { AiOutlineDelete, AiOutlineUpload, AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import AdminLayout from "./adminnavbar";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [designation, setDesignation] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await api.get("/testimonial/get");
            setTestimonials(response.data.testimonials);
           
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            toast.error("Failed to fetch testimonials");
        }
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("designation", designation);
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        try {
            await api.post("/testimonial/add", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setOpenModal(false);
            resetForm();
            fetchTestimonials();
            toast.success("Testimonial added successfully!");
        } catch (error) {
            console.error("Error adding testimonial:", error);
            toast.error("Failed to add testimonial");
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDesignation("");
        setProfileImage(null);
        setSelectedTestimonial(null);
    }
    const handleEdit = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setTitle(testimonial.title);
        setDescription(testimonial.description);
        setDesignation(testimonial.designation);
        setProfileImage(null);
        setEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedTestimonial) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("designation", designation);
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        try {
            await api.put(`/testimonial/edit/${selectedTestimonial._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setEditModal(false);
            fetchTestimonials();
            toast.success("Testimonial updated successfully!");
        } catch (error) {
            console.error("Error updating testimonial:", error);
            toast.error("Failed to update testimonial");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/testimonial/${id}`);
            fetchTestimonials();
            toast.success("Testimonial deleted successfully!");
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            toast.error("Failed to delete testimonial");
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Testimonials</h2>
                    <button 
                        onClick={() => setOpenModal(true)} 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                    >
                        <AiOutlinePlus className="mr-2" /> Add Testimonial
                    </button>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                            {testimonial.profileImage && <img src={`http://localhost:9090${testimonial.profileImage}`} alt="Profile" className="w-16 h-16 rounded-full mb-2" />}
                            <h3 className="font-bold">{testimonial.title}</h3>
                            <p className="text-sm text-gray-600">{testimonial.designation}</p>
                            <p className="mt-2">{testimonial.description}</p>
                            <div className="flex space-x-2 mt-2">
                                <button 
                                    onClick={() => handleEdit(testimonial)} 
                                    className="text-blue-500 flex items-center"
                                >
                                    <AiOutlineEdit className="mr-2" /> Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(testimonial._id)} 
                                    className="text-red-500 flex items-center"
                                >
                                    <AiOutlineDelete className="mr-2" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Testimonial Modal */}
                {openModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto">
                            <h2 className="text-lg font-bold mb-4">Add Testimonial</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 w-full" />
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full" placeholder="Title" required />
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full" rows="3" placeholder="Description" required></textarea>
                                <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="border p-2 w-full" placeholder="Designation" required />
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
                                    <AiOutlineUpload className="mr-2" /> Upload Testimonial
                                </button>
                                <button onClick={() => setOpenModal(false)} className="bg-gray-300 px-4 py-2 rounded-lg ml-2">Cancel</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Testimonial Modal */}
                {editModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto">
                            <h2 className="text-lg font-bold mb-4">Edit Testimonial</h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 w-full" />
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full" required />
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full" rows="3" required></textarea>
                                <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="border p-2 w-full" required />
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">Update</button>
                                <button onClick={() => setEditModal(false)} className="bg-gray-300 px-4 py-2 rounded-lg ml-2">Close</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default Testimonials;
