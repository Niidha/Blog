import {createSlice} from "@reduxjs/toolkit"
const authorSlice=createSlice({
    name:"author",
    initialState:{
        id: "",
        name:"",
        username:"",
        email:"",
        phone:""
    },
    reducers:{
        createUser:(state,action)=>{
            state.id = action.payload._id
            state.name=action.payload.name
            state.authorname=action.payload.authorname
            state.email=action.payload.email
            state.phone=action.payload.phone
        },
        logoutUser:(state)=>{
             state.id= ""
            state.name=""
            state.authorname=""
            state.email=""
            state.phone=""
        }
    }
})
export const {createUser,logotUser}=authorSlice.actions
export const{reducer: authorReducer}=authorSlice