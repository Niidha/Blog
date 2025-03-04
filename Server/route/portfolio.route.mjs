import express from "express";
import { 
    createPortfolio, 
    getPortfolios, 
    getPortfolioById, 
    updatePortfolio, 
    deletePortfolio 
} from "../controller/portfolio.controller.mjs";
import { upload } from "../middleware/upload.mjs";

const PortfolioRoute = express.Router();

// ✅ Route to Add Portfolio with File Upload
PortfolioRoute.post(
    "/add",
    
    createPortfolio
);

// ✅ Route to Get All Portfolios
PortfolioRoute.get("/all", getPortfolios);

// ✅ Route to Get a Single Portfolio by ID
PortfolioRoute.get("/:id", getPortfolioById);

// ✅ Route to Update Portfolio with File Upload
PortfolioRoute.put(
    "/update/:id",
   

    updatePortfolio
);

// ✅ Route to Delete Portfolio
PortfolioRoute.delete("/delete/:id", deletePortfolio);

export default PortfolioRoute;
