import { configureStore } from "@reduxjs/toolkit";
import { authorReducer } from "./authorSlice";



export const store=configureStore({
    reducer:{
        author:authorReducer,
        
      
    }
})