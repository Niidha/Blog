import { Router } from "express";
import { getBlogDetails } from "../controller/post.controller.mjs";
import { blogCollection } from "../model/post.model.mjs";

const userRoute=Router()
userRoute.get('/:blogId', getBlogDetails);

export default userRoute