import { Notification } from "../model/notification.model.mjs";

export const sendNotification = async (req, res) => {
    try {
        let { recipients, message } = req.body;

        console.log("📌 Received Body:", req.body); // Debugging line

        if (!recipients || !message.trim()) {
            return res.status(400).json({ error: "Recipients and message are required" });
        }

        // Ensure recipients is always an array
        if (!Array.isArray(recipients)) {
            recipients = [recipients]; // Convert single string to array
        }

        console.log("📌 Parsed Recipients:", recipients); // Debugging line

        if (recipients.length === 0) {
            return res.status(400).json({ error: "At least one recipient is required" });
        }

        // Create and store notifications
        const notifications = recipients.map((recipient) => ({
            recipient,
            message,
            createdAt: new Date(),
        }));

        const savedNotifications = await Notification.insertMany(notifications);

        console.log("📌 Saved Notifications:", savedNotifications); // Debugging line

        res.status(200).json({ message: "Notifications sent successfully!", notifications: savedNotifications });
    } catch (error) {
        console.error("❌ Error sending notification:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};





// ✅ Get All Notifications (Admin)
export const getGeneralNotifications = async (req, res) => {
    try {
        console.log("📌 Fetching only general notifications...");

        const generalNotifications = await Notification.find({ type: "general" }).sort({ createdAt: -1 });

        console.log("🔍 Query Result:", generalNotifications);

        if (!generalNotifications || generalNotifications.length === 0) {
            console.log("⚠️ No general notifications found.");
            return res.status(200).json({ success: true, notifications: [] });
        }

        console.log(`✅ Found ${generalNotifications.length} general notifications.`);
        res.status(200).json({ success: true, notifications: generalNotifications });
    } catch (error) {
        console.error("❌ Error fetching general notifications:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};


export const getRecipientNotifications = async (req, res) => {
    try {
        const { recipient } = req.params;
        console.log(`📌 Fetching notifications for recipient: ${recipient}`);

        const notifications = await Notification.find({ recipient }).sort({ createdAt: -1 });

        if (!notifications.length) {
            console.log("⚠️ No notifications found for this recipient.");
            return res.status(200).json({ notifications: [] });
        }

        console.log(`✅ Found ${notifications.length} notifications for recipient ${recipient}.`);
        res.status(200).json({ notifications });
    } catch (error) {
        console.error("❌ Error fetching recipient notifications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getUnreadNotifications = async (req, res) => {
    try {
        const { recipient } = req.params; // Ensure correct parameter name
        console.log("Fetching unread notifications for:", recipient);

        if (!recipient) {
            return res.status(400).json({ error: "Recipient is required" });
        }

        // Query unread notifications
        const unreadNotifications = await Notification.find({
            recipient: recipient, // Ensure field name matches database
            isRead: false
        }).sort({ createdAt: -1 });

        // Log for debugging
        console.log("Unread Notifications:", unreadNotifications.length);

        res.status(200).json({ count: unreadNotifications.length, notifications: unreadNotifications });
    } catch (error) {
        console.error("❌ Error fetching unread notifications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true } // Return updated document
        );

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("❌ Error marking notification as read:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const { recipient } = req.params;

        await Notification.updateMany(
            { recipients: recipient, isRead: false }, // Only update unread notifications
            { isRead: true }
        );

        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("❌ Error marking all notifications as read:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};