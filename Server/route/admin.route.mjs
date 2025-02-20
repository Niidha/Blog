import { Router } from "express";
import { getAllAuthors } from "../controller/admin.controller.mjs";

const adminRoute=Router()
adminRoute.get('/authors', getAllAuthors);


export default adminRoute