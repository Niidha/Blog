import React, { useEffect, useState } from "react";
import { api } from "../../axios";
import { Link } from "react-router-dom";


function LatestPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetchLatestData();
        fetchTestimonials();
    }, []);

    const fetchLatestData = async () => {
        try {
            const portfolioResponse = await api.get("/portfolio/latest");
            console.log("Portfolio Response:", portfolioResponse.data); // 🔍 Debug Log
            setPortfolios(portfolioResponse.data.portfolios || []);

            const galleryResponse = await api.get("/gallery/latest");
            console.log("Gallery Response:", galleryResponse.data); // 🔍 Debug Log
            setGalleryImages(galleryResponse.data.images || []);
        } catch (error) {
            console.error("Error fetching latest data:", error);
        }
    };

    const fetchTestimonials = async () => {
        try {
            const response = await api.get("/testimonial/get");
            setTestimonials(response.data.testimonials);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) =>
                prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials]);

    return (
        <div className="max-w-6xl mx-auto p-6">
           <h2 className="text-3xl font-bold mb-4 text-center  text-gray-800">Latest Portfolios</h2>
            {portfolios.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {portfolios.map((portfolio) => (
                       <Link to={`/portfolio/${portfolio._id}`}> <div key={portfolio._id} className="bg-white shadow-lg p-6 rounded-lg h-[320px] flex flex-col">
                       {portfolio.image ? (
                           <img
                               src={portfolio.image.startsWith("http") ? portfolio.image : `http://localhost:9090${portfolio.image}`} 
                               alt={portfolio.title || "Portfolio"}
                               className="w-full h-40 object-cover rounded-lg mb-4"
                           />
                       ) : (
                           <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center">
                               No Image Available
                           </div>
                       )}
                       <h3 className="text-xl font-semibold flex-grow">{portfolio.title || "No Title"}</h3>
                   </div>
                   
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No portfolios available.</p>
            )}

<h2 className="text-3xl font-bold mt-10 mb-4 text-center  text-gray-800">Latest Gallery</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
  {Array.isArray(galleryImages) &&
    galleryImages.map((img, index) =>
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
          </div>
        </div>
      ) : null
    )}
</div>

           

<section className="relative overflow-hidden mt-10">
    <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">What People Say</h2>
    <div className="flex justify-center items-center relative overflow-hidden">
        <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
                transform: `translateX(-${index * 100 / testimonials.length}%)`,
                width: `${testimonials.length * 100}%`,
            }}
        >
            {testimonials.map((testimonial, i) => (
                <div
                    key={testimonial._id}
                    className="flex-shrink-0 w-[22%] flex justify-center items-center transition-all duration-500 ease-in-out"
                >
                    <div className="bg-white shadow-md p-3 rounded-lg w-64 text-center">
                        {testimonial.profileImage && (
                            <img
                                src={`http://localhost:9090${testimonial.profileImage}`}
                                alt="Profile"
                                className="w-14 h-14 rounded-full mx-auto mb-2"
                            />
                        )}
                        <h3 className="text-base font-semibold">{testimonial.title}</h3>
                        <p className="text-xs text-gray-600">{testimonial.designation}</p>
                        <p className="mt-2 text-sm text-gray-700">{testimonial.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
</section>

        </div>
    );
}

export default LatestPage;
