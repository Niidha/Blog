import { model, Schema } from "mongoose";


const TestimonialSchema = new Schema({
    title: {
        type:String,
        required:[true,"Title is Required"]
    },
    description: {
        type:String,
        required:[true,"Description is Required"]
    },
    designation: {
        type:String,
        required:[true,"Designation is Required"]
    },
    profileImage: {
        type:String,
        required:[true,"Image is Required"]
    },
});
export const Testimonials = model('Testimonials', TestimonialSchema);
