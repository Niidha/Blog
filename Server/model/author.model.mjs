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
    profileUrl:
     { type: String, default: "" }, 
    
     bio:
      { type: String, default: "" },
  github:
   { type: String, default: "" },
  linkedin: 
  { type: String, default: "" },
  instagram: 
  { type: String, default: "" },
  youtube:
   { type: String, default: "" },
},{timestamps:true});
export const authorCollection = model("authors",AuthorSchema)