import { authorCollection } from '../model/author.model.mjs';
import { Notification } from '../model/notification.model.mjs';
import bcrypt from "bcryptjs";


export const getAllAuthors = async (req, res) => {
  try {
    // Fetch authors with relevant details like 'username', 'profileUrl', etc.
    const authors = await authorCollection.find({}, 'name profileUrl bio');

    if (authors.length === 0) {
      return res.status(404).json({ message: 'No authors found' });
    }

    // Return the authors with their details
    return res.status(200).json(authors); 
  } catch (error) {
    console.error('Error fetching authors:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const getAdminDashboardData = async (req, res) => {
  try {
      const dashboardData = await authorCollection.aggregate([
          {
              $match: { role: "author" } // Ensure only authors are retrieved
          },
          {
              $lookup: {
                  from: "blogposts", // Collection name for blogs
                  localField: "username",
                  foreignField: "author",
                  as: "blogs"
              }
          },
          {
              $project: {
                  authorId: "$_id",
                  authorName: "$name",
                  totalBlogs: { $size: "$blogs" }, // Get total blog count
                  publishedCount: {
                      $size: {
                          $filter: {
                              input: "$blogs",
                              as: "blog",
                              cond: { $eq: ["$$blog.published", true] }
                          }
                      }
                  },
                  unpublishedCount: {
                      $size: {
                          $filter: {
                              input: "$blogs",
                              as: "blog",
                              cond: { $eq: ["$$blog.published", false] }
                          }
                      }
                  },
                  blogs: {
                      $map: {
                          input: "$blogs",
                          as: "blog",
                          in: { blogId: "$$blog._id", title: "$$blog.title" }
                      }
                  }
              }
          }
      ]);

      res.status(200).json({ success: true, data: dashboardData });
  } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// Send Admin Invitation
export const inviteToAdmin = async (req, res) => {
    try {
        const { authorId } = req.body;

        const author = await authorCollection.findById(authorId);
        if (!author) {
            return res.status(404).json({ success: false, message: "Author not found" });
        }

        if (author.role === "admin") {
            return res.status(400).json({ success: false, message: "User is already an admin" });
        }

        // Update user's invitation status
        author.isInvited = true;
        await author.save();

        // Create notification
        const notification = new Notification({
            recipient: author._id,
            message: "You have been invited to become an admin. Accept or Reject?",
            type: "invitation",
        });
        await notification.save();

        res.status(200).json({ success: true, message: "Invitation sent successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending invitation", error });
    }
};
export const getAdminNotifications = async (req, res) => {
    try {
        // Only fetch notifications of type "admin-notification"
        const notifications = await Notification.find({ type: "admin-notification" })
            .sort({ createdAt: -1 }) // Sort by latest
            .limit(20); // Fetch latest 20 notifications

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching admin notifications:", error);
        res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
};

// Create a new user (Admin only)

export const createUser = async (req, res) => {
    try {
        const { name, username, email, phone, password, role } = req.body;

        // Check for missing fields
        if (!name || !username || !email || !phone || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await authorCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new authorCollection({ 
            name, 
            username, 
            email, 
            phone, 
            password: hashedPassword, 
            role 
        });

        // Save to database
        await newUser.save();

        res.status(201).json({ success: true, message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ success: false, message: "Error creating user", error: error.message });
    }
};


// Delete a user (Admin only)
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await authorCollection.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user", error });
    }
};






