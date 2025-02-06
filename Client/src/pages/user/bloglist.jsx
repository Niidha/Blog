import React, { useEffect, useState } from "react";

function BlogList() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/blog/author/blogs")
            .then((res) => res.json())
            .then((data) => setBlogs(data))
            .catch((error) => console.error("Error fetching blogs:", error));
    }, []);

    return (
        <div>
            <h2>All Blogs</h2>
            {blogs.length === 0 ? (
                <p>No blogs available.</p>
            ) : (
                blogs.map((blog) => (
                    <div key={blog._id} style={styles.blogCard}>
                        <div style={styles.blogContent}>
                            {blog.imageUrl && (
                                <img
                                 src={`http://localhost:8000/${blog.imageUrl}`} alt="Blog Image" 

                                    style={styles.image}
                                />
                               

                            )}
                            <div style={styles.textContent}>
                                <p style={styles.category}>{blog.category}</p>
                                <h3>{blog.title}</h3>
                                <p>{blog.description}</p>
                                <div style={styles.bottomContent}>
                                    <p style={styles.author}>Author: {blog.author}</p>
                                    <p style={styles.date}>Created At: {blog.createdAt.split("T")[0]}</p>
                                </div>
                              
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

const styles = {
    blogCard: {
        border: "1px solid #ddd",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
    },
    blogContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
    },
    image: {
        width: "200px", // Set the width of the image
        height: "auto", // Maintain aspect ratio
        marginRight: "20px", // Space between image and text
        borderRadius: "5px",
    },
    textContent: {
        flex: 1,
    },
    category: {
        fontWeight: "bold",
        color: "#007BFF",
        marginBottom: "10px",
    },
    bottomContent: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px",
    },
    author: {
        fontStyle: "italic",
    },
    date: {
        fontSize: "0.9em",
        color: "#555",
    },
};

export default BlogList;
