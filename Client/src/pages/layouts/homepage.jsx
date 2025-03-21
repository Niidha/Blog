import React from "react";
import Navbar from "./navbar";

import LatestPage from "./latest";


export default function HomePage() {
  return (
  <div>
  <Navbar/>
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-fullshadow-lg rounded-lg overflow-hidden">
        <div className="w-full h-96">
          <img
            src="https://cdn4.vectorstock.com/i/1000x1000/29/18/blog-management-social-media-vector-10472918.jpg"
            alt="Blogging"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Blog Space</h1>
          <p className="text-lg text-gray-600 mb-6">
            Blogging is an incredible way to express your thoughts, share your expertise, and engage with a global audience. Whether you're a seasoned writer or just starting out, our platform provides the tools you need to create, manage, and enhance your content seamlessly. You can write about your passions, keep a personal journal, or even establish yourself as a thought leader in your industry. With intuitive editing features, real-time collaboration, and a sleek design, your blogging experience has never been easier. Start today and bring your ideas to life!
          </p>
         
        </div>
      </div>
    </div>
 <LatestPage/>
    </div>
  );
}
