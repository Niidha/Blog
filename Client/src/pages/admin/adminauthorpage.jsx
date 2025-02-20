import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../axios';  
import AdminLayout from './adminnavbar';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
     
        const response = await api.get('/admin/authors');
        
        const authorsData = response.data.map((author) => ({
          ...author,
          username: author.name,
        }));

        setAuthors(authorsData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching authors');
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return <div>Loading authors...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold text-center mb-8">Authors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {authors.map((author) => (
            <div
              key={author.username}  
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
            >
              <img
                src={author.profileUrl ? `http://localhost:9090/${author.profileUrl}` : 'https://static.vecteezy.com/system/resources/previews/020/765/399/large_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}  // Default image if no profileUrl
                alt={author.username}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-medium text-gray-800 mb-2">{author.username}</h3>
                <Link
                  to={`/author/${author.username}`}  
                  className="text-blue-500 hover:underline"
                >
                  View Blogs
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AuthorList;
