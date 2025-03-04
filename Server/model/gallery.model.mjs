import {model, Schema} from 'mongoose'

const GallerySchema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Gallery = model("Gallery", GallerySchema);
