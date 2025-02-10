import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser"; 

function ViewBlog() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/blog/${id}`);
                setBlog(response.data.blog);
            } catch (err) {
                console.error("Error fetching blog details:", err);
            }
        };
        fetchBlog();
    }, [id]);

    if (!blog) return <p className="text-center text-gray-500 text-lg mt-10">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
           
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
                {blog.title || "Untitled Blog"}
            </h1>

           
            <div className="flex justify-between items-center text-gray-600 text-sm mb-6 border-b pb-4">
                <p className="italic p-3">Author: {blog.author || "Unknown"}</p>
                <p>Created At: {blog.createdAt ? blog.createdAt.split("T")[0] : "Unknown"}</p>
            </div>

         
            <p className="text-lg font-semibold text-blue-500 text-right mb-4">Category: {blog.category || "Uncategorized"}</p>

       
            {blog.imageUrl && (
                <div className="flex justify-center mb-6 ">
                    <img
                        src={`http://localhost:8000/${blog.imageUrl}`}
                        alt="Blog"
                        className="w-full max-h-[450px] object-cover rounded-lg shadow-md"
                    />
                </div>
            )}

           
            <p className="text-gray-700 text-lg leading-relaxed my-6 text-justify">
                {blog.description || "No description available."}
            </p>

        
            <div className="mt-8 border-t pt-6 space-y-6 text-gray-800 text-lg leading-relaxed">
    {blog.content ? (
        <div className="space-y-6">
            {parse(blog.content, {
                replace: (domNode) => {
                    
                    if (domNode.name === "img" && domNode.attribs) {
                        return (
                            <div key={domNode.attribs.src} className="flex justify-center my-4">
                                <img
                                    src={domNode.attribs.src}
                                    alt={domNode.attribs.alt || "Blog Image"}
                                    className="rounded-lg shadow-md max-w-full h-auto"
                                />
                            </div>
                        );
                    }
                    
                },
            })}
        </div>
    ) : (
        <p>No content available.</p>
    )}
</div>


            {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                <div className="mt-6">
                    <h2 className="font-bold text-gray-700 text-xl mb-2">Tags:</h2>
                    <ul className="flex flex-wrap">
                        {blog.tags.map((tag, index) => (
                            <li
                                key={index}
                                className="bg-blue-100 text-blue-700 px-3 py-1 m-1 rounded-full text-sm font-medium"
                            >
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ViewBlog;
