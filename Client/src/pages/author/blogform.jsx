import React, { useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css'; 
import { api } from '../../axios';
import ReactQuill from 'react-quill';
import toast from 'react-hot-toast';
import {  Link, useNavigate} from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate()
  const userProfileImage = localStorage.getItem('profileImage')


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
       
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success('Blog created successfully')

    if (!title || !content || !author || !category || !description) {
      alert('All fields are required!');
      return;
    }

    const blogData = {
      title,
      content,
      author,
      category,
      description,
      image: image || null, 
    };

    try {
      const response = await api.post('/author/createblog', blogData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Blog created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog');
    }
  };
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-3">
      <div className='flex justify-between'>
      
      <Link to={`/profile`}>
      <img
        src={userProfileImage || "https://www.iconbolt.com/preview/facebook/those-icons-glyph/user-symbol-person.svg"} 
        alt="Profile"
        className="w-14 h-14 rounded-full object-cover"
      />
    </Link>
      <div className='m-3 flex justify-end gap-2'>
      
      <button>Publish</button>
      <button 
            onClick={() => navigate("/myblogs")} 
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 me-2"
        >
            View My Blogs
        </button>
      <button onClick={logout}   className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 ">log out</button>

      </div>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6">Create Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium mb-2 ">Title:</label>
          <input 
            id="title"
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-lg font-medium mb-2">Image:</label>
          <input 
            id="image"
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="w-full bg-gray-100 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-lg font-medium mb-2">Author:</label>
          <input 
            id="author"
            type="text" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-lg font-medium mb-2">Category:</label>
          <input 
            id="category"
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-lg font-medium mb-2">Description:</label>
          <input 
            id="description"
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-lg font-medium mb-2 ">Content:</label>
          <ReactQuill className='w-3xl h-30'
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ 'font': [] }, { 'header': [] },],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['bold', 'italic', 'underline'],
                ['image'],
                
              ],
            }}
            required
          />
        </div>
        <div className="flex justify-center">
          <button 
        
            type="submit" 
            className= "mt-9 text-white bg-blue-900 py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Create Blog
          </button>
       
          
          
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
