import { model, Schema } from "mongoose";

const AuthorSchema=new Schema({
    name:{
        type:String,
        required:[true,"Name is Required"]
    },
    username:{
        type:String,
        required:[true,"Username is Required"],
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true,
    },
    phone:{
        type:Number,
        required:[true,"Phone number is Required"],
    },
    password:{
        type:String,
        required:[true,"Password is Required"]
    },
},{timestamps:true});
export const authorCollection = model("authors",AuthorSchema)