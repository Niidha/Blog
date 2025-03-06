import { Router } from "express";
import { deleteImage, getGallery, uploadImage, uploadMiddleware } from "../controller/gallery.controller.mjs";
import { Gallery } from "../model/gallery.model.mjs";

const GalleryRoute = Router();

GalleryRoute.get("/images", getGallery);
GalleryRoute.post("/", uploadMiddleware, uploadImage);
GalleryRoute.delete("/:id", deleteImage);
GalleryRoute.put("/reorder", async (req, res) => {
    try {
      const { images } = req.body; // Array of image IDs in new order
      for (let i = 0; i < images.length; i++) {
        await Gallery.updateOne({ _id: images[i] }, { order: i });
      }
      res.status(200).json({ success: true, message: "Order updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });
  

export default GalleryRoute;
