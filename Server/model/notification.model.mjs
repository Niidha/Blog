import { model, Schema } from "mongoose";

const NotificationSchema = new Schema(
    {
        recipient: { type: String, required: true }, // Recipient's username
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false }, // Default unread
        createdAt: { type: Date, default: Date.now },
      
   

    },
    
);

export const Notification = model("Notification", NotificationSchema);

