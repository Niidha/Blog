import { blogCollection } from "../model/post.model.mjs"; // Ensure correct import
import { Review } from "../model/review.model.mjs";
import { Notification } from "../model/notification.model.mjs";

// ✅ Submit Blog for Review (User)
export const SubmitReview = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await blogCollection.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        if (!blog.adminUnpublished) {
            return res.status(403).json({ message: "This blog is already published. No review needed." });
        }

        // ✅ Create a new review entry every time the blog is submitted for review
        const newReview = new Review({
            blogId,
            authorId: req.user.id, // Ensure authentication middleware adds user to req
            reviewStatus: "pending",
            submittedAt: new Date()
        });

        await newReview.save();

        res.status(200).json({ message: "Blog submitted for review successfully", review: newReview });
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ message: "Error submitting review", error: error.message || error });
    }
};



export const GetAllReviews = async (req, res) => {
    try {
        console.log("Fetching reviews...");

        const reviews = await Review.find()
            .populate({ path: "blogId", model: "blogposts", select: "title" }) // Correct model name for blogs
            .populate({ path: "authorId", model: "authors", select: "name" }); // Correct model name for authors

        console.log("Fetched reviews:", reviews);

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
};


export const ReviewBlog = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { action } = req.body; // 'approve' or 'reject'
        
        const review = await Review.findById(reviewId).populate({ path: "authorId", model: "authors", select: "username" });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        const blog = await blogCollection.findById(review.blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        let notificationMessage = "";

        if (action === "approve") {
            blog.adminUnpublished = false;
            blog.reviewStatus = "approved"; // ✅ Updating blog's review status
            notificationMessage = `Your blog "${blog.title}" has been approved by the admin.`;
        } else if (action === "reject") {
            blog.adminUnpublished = true;
            blog.reviewStatus = "rejected"; // ✅ Updating blog's review status
            notificationMessage = `Your blog "${blog.title}" has been rejected by the admin. Please make necessary changes.`;
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }

        await blog.save();

        // ✅ Remove the review from the reviews collection
        await Review.findByIdAndDelete(reviewId);

        // ✅ Send Notification to the Author
        await Notification.create({
            recipient: review.authorId.username, // Using username as recipient
            message: notificationMessage
        });

        res.status(200).json({ 
            message: `Blog review ${action}d successfully`, 
            reviewStatus: blog.reviewStatus 
        });

    } catch (error) {
        console.error("❌ Error processing review:", error);
        res.status(500).json({ message: "Error processing review", error: error.message });
    }
};

