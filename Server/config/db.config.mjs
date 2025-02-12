import { connect } from "mongoose";
import env from "dotenv";

env.config();

const dbConnect = async () => {
    try {
        const connection = await connect(process.env.MONGO_URL, {
            dbName: "Blog", // ✅ Use `dbName` directly
        });

        console.log("Connected to database:", connection.connection.db.databaseName);
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

export default dbConnect;
