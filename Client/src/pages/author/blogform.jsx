import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css'; 
import { api } from '../../axios';
import ReactQuill from 'react-quill';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold text-center mb-6">Create Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium mb-2">Title:</label>
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
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label htmlFor="content" className="block text-lg font-medium mb-2">Content:</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ 'font': [] }, { 'header': [] }],
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
            className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Create Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
