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

    const bulkOps = images.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index }
      }
    }));

    await Gallery.bulkWrite(bulkOps);

    res.status(200).json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

  

export default GalleryRoute;
