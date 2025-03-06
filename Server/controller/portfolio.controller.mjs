import Portfolio from "../model/portfolio.model.mjs";

// ✅ Create Portfolio
export const createPortfolio = async (req, res) => {
    try {
        console.log("📌 Request Body:", req.body);

        const { category, title, services, industry, content, videoUrls, imageUrls, portfolioImage } = req.body;
        if (!category || !title || !content) {
            return res.status(400).json({ message: "Category, title, and content are required." });
        }

        const parsedServices = Array.isArray(services) ? services.map(service => ({
            head: service.head ? service.head.trim() : "",
            description: service.description ? service.description.trim() : "",
        })) : [];

        const portfolioItem = new Portfolio({
            category,
            title,
            image: portfolioImage,
            services: parsedServices,
            content,  // Quill content saved as-is (HTML format)
            industry,
            videoUrls: Array.isArray(videoUrls) ? videoUrls.map(url => url.trim()) : [],
            imageUrls: Array.isArray(imageUrls) ? imageUrls.map(url => url.trim()) : [],
        });

        console.log("✅ Saving Portfolio:", portfolioItem);
        await portfolioItem.save();
        res.status(201).json({ success: true, message: "Portfolio added successfully!", portfolioItem });

    } catch (error) {
        console.error("🚨 Server Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// ✅ Get All Portfolios
export const getPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, portfolios });
    } catch (error) {
        console.error("🚨 Server Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get Single Portfolio by ID
export const getPortfolioById = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
        res.status(200).json({ success: true, portfolio });
    } catch (error) {
        console.error("🚨 Server Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
export const updatePortfolio = async (req, res) => {
    try {
        console.log("📌 Received in Backend:", req.body);

        const { category, title, industry, image, services, videoUrls, imageUrls } = req.body;
        const portfolioId = req.params.id;

        let portfolio = await Portfolio.findById(portfolioId);
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        // ✅ No need to parse, directly use the request data
        const updateFields = {
            category: category || portfolio.category,
            title: title || portfolio.title,
            industry: industry || portfolio.industry,
            services: Array.isArray(services) ? services : portfolio.services,
            videoUrls: Array.isArray(videoUrls) ? videoUrls : portfolio.videoUrls,
            imageUrls: Array.isArray(imageUrls) ? imageUrls : portfolio.imageUrls,
            image: image || portfolio.image,
        };

        console.log("🔄 Updating Fields:", updateFields);

        const updatedPortfolio = await Portfolio.findByIdAndUpdate(
            portfolioId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        console.log("✅ Portfolio After Update:", updatedPortfolio);
        res.status(200).json({ success: true, message: "Portfolio updated successfully!", portfolio: updatedPortfolio });

    } catch (error) {
        console.error("🚨 Server Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// ✅ Delete Portfolio
export const deletePortfolio = async (req, res) => {
    try {
        const deletedPortfolio = await Portfolio.findByIdAndDelete(req.params.id);
        if (!deletedPortfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
        res.status(200).json({ success: true, message: "Portfolio deleted successfully" });
    } catch (error) {
        console.error("🚨 Server Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
