import { Router } from "express";
import { getAllNotifications, getNotificationsForAuthor, sendNotification } from "../controller/notification.controller.mjs";


const notifyRoute=Router()
notifyRoute.post("/send", (req, res) => sendNotification(req, res, req.io)); // Send Notification
notifyRoute.get("/:author", getNotificationsForAuthor); // Get Notifications for an Author
notifyRoute.get("/notifications", getAllNotifications); // Get All Notifications (Admin)






export default notifyRoute