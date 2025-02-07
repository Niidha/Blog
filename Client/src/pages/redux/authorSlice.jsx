import { createSlice } from "@reduxjs/toolkit";

const authorSlice = createSlice({
    name: "author",
    initialState: {
        id: "",
        name: "",
        username: "", 
        email: "",
        phone: ""
    },
    reducers: {
        createUser: (state, action) => {
            state.id = action.payload._id;
            state.name = action.payload.name;
            state.username = action.payload.username;  
            state.email = action.payload.email;
            state.phone = action.payload.phone;
        },
        logoutUser: (state) => {
            state.id = "";
            state.name = "";
            state.username = ""; 
            state.email = "";
            state.phone = "";
        }
    }
});

export const { createUser, logoutUser } = authorSlice.actions;
export const { reducer: authorReducer } = authorSlice;
