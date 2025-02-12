import { Router } from "express";
import { getBlogDetails } from "../controller/post.controller.mjs";

const userRoute=Router()
userRoute.get('/:blogId', getBlogDetails);


export default userRoute