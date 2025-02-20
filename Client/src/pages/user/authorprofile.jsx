import { FaGithub, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function AuthorDetails() {
    const { username } = useParams();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:9090/blog/author/details/${username}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setAuthor(data);
                }
                setLoading(false);
            })
          
            .catch((error) => {
                setError("Error fetching author details");
                setLoading(false);
            });
    }, [username]);

    if (loading) return <p className="text-center text-lg text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!author) return <p className="text-center text-red-500">Author not found.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <div className="flex flex-col items-center text-center">
                {author.profileUrl ? (
                    <img src={`http://localhost:9090/${author.profileUrl}`} alt={author.name} className="w-32 h-32 rounded-full shadow-md mb-4" />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-lg mb-4">
                        No Image
                    </div>
                )}
                <h1 className="text-3xl font-semibold">{author.name}</h1>
                <p className="text-gray-500">@{author.username}</p>
                <p className="mt-2 text-gray-700">{author.bio || "No bio available."}</p>

                {/* Social Links */}
                <div className="mt-6 flex space-x-4">
                    {author.github && (
                        <a href={author.github} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700 text-2xl">
                            <FaGithub />
                        </a>
                    )}
                    {author.linkedin && (
                        <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 text-2xl">
                            <FaLinkedin />
                        </a>
                    )}
                    {author.instagram && (
                        <a href={author.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400 text-2xl">
                            <FaInstagram />
                        </a>
                    )}
                    {author.youtube && (
                        <a href={author.youtube} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 text-2xl">
                            <FaYoutube />
                        </a>
                    )}
                </div>
               
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
                <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Back to Blogs
                </Link>
            </div>
        </div>
    );
}

export default AuthorDetails;
