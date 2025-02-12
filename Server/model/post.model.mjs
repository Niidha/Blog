import { model, Schema } from "mongoose";

const blogSchema = new Schema({
    title:{ 
        type:String,
        required:[true,"Title is Required"]
    },
    description:{
        type:String,
        required:[true,"Content is Required"]
    },
    content: {
        type:String,
        required:[true,"Content is Required"]

    },
    author:{ 
        type:String,
        required:[true,"Author is Required"]

    },
    imageUrl:{ 
        type:String,
        required:[true,"Image is Required"]
    },
    category:{ 
        type:String,
        required:[true,"Category is Required"]
    },
    createdAt: { 
        type: Date, 
        default: () => new Date().toISOString().split("T")[0],
    required:[true,"Date is Required"]
    },
    published: { 
        type: Boolean, 
        default: false  
    }
  });
  
  export const blogCollection = model("blogposts", blogSchema);