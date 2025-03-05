import { Router } from "express";
import { Auth} from "../middleware/auth.mjs";
import { GetAllReviews, ReviewBlog, SubmitReview } from "../controller/review.controller.mjs";

const reviewRoute=Router()
reviewRoute.post('/submit-review/:id',Auth, SubmitReview);
reviewRoute.get('/reviews', GetAllReviews);
reviewRoute.post('/reviews/:id',  ReviewBlog);


export default reviewRoute