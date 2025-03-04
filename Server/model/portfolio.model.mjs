import { model, Schema } from "mongoose";

const PortfolioSchema = new Schema({
    category: { type: String, required: true }, 
    title: { type: String, required: true }, 
    image: { type: String, required: false }, 
    services: [{ 
        head: { type: String, required: false }, 
        description: { type: String, required: false }
    }], 
    industry: { type: String, required: false }, 
    videoUrls: [{ type: String, required: false }], 
    imageUrls: [{ type: String, required: false }], 
    createdAt: { type: Date, default: Date.now }, 
});

const Portfolio = model("Portfolio", PortfolioSchema);
export default Portfolio;
