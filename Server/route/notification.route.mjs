import { Router } from "express";
import { getNotificationsForAuthor, getRecipientNotifications, getUnreadNotifications, markAllNotificationsAsRead, markNotificationAsRead, sendNotification } from "../controller/notification.controller.mjs";


const notifyRoute=Router()
notifyRoute.post("/send", (req, res) => sendNotification(req, res, req.io)); // Send Notification
notifyRoute.get("/:author", getNotificationsForAuthor); // Get Notifications for an Author
notifyRoute.get("/:recipient", getRecipientNotifications); // Get only unread notifications
notifyRoute.get("/unread/:recipient", getUnreadNotifications); // Get only unread notifications
notifyRoute.put("/read/:id", markNotificationAsRead); // Mark a single notification as read
notifyRoute.put("/read/all/:recipient", markAllNotificationsAsRead); // Mark all as read






export default notifyRoute