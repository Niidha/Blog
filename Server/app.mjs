import env from "dotenv"
import dbConnect from "./config/db.config.mjs"
import express from "express"
import cors from "cors"
import authorRoute from "./route/author.route.mjs"
import userRoute from "./route/user.route.mjs"
env.config()
await dbConnect()
const app=express()
app.use(express.json())
app.use(cors())

app.use("/uploads", express.static("uploads"));
app.use("/blog/author",authorRoute)
app.use("/blog",userRoute)
app.listen(process.env.PORT||8000,err=>{
    if(err){
        return process.exit(1)
    }
    console.log("Running...");
    
})