import { Router } from "express";
import { deleteImage, getGallery, uploadImage, uploadMiddleware } from "../controller/gallery.controller.mjs";

const GalleryRoute = Router();

GalleryRoute.get("/images", getGallery);
GalleryRoute.post("/", uploadMiddleware, uploadImage);
GalleryRoute.delete("/:id", deleteImage);

export default GalleryRoute;
