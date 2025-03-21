import { useState, useEffect } from "react";

const TestimonialsCarousel = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [index, setIndex] = useState(0);
    const visibleSlides = 3;

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch("http://localhost:9090/blog/testimonial");
                const data = await response.json();
                setTestimonials(data.testimonials || []);
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            }
        };

        fetchTestimonials();
    }, []);

    useEffect(() => {
        if (testimonials.length > 0) {
            const interval = setInterval(() => {
                setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [testimonials]);

    if (testimonials.length === 0) {
        return <p className="text-center text-gray-500">No testimonials available</p>;
    }

    return (
        <section className="relative overflow-hidden mt-10">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">What People Say</h2>
            <div className="flex justify-center items-center overflow-hidden w-full">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        transform: `translateX(-${index * (100 / visibleSlides)}%)`,
                        width: `${(testimonials.length + visibleSlides) * (100 / visibleSlides)}%`,
                    }}
                >
                    {[...testimonials, ...testimonials.slice(0, visibleSlides)].map((testimonial, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-1/3 flex justify-center items-center transition-all duration-500 ease-in-out"
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
    );
};

export default TestimonialsCarousel;
