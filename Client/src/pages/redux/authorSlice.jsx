import { createSlice } from "@reduxjs/toolkit";

// Get stored user data from localStorage
const storedUser = JSON.parse(localStorage.getItem("user")) || null;

const authorSlice = createSlice({
    name: "author",
    initialState: {
        user: storedUser, // Load user from localStorage on page refresh
        token: localStorage.getItem("access_token") || null,
    },
    reducers: {
        createUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload)); // Save to localStorage
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("access_token", action.payload);
        },
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
        },
    },
});

export const { createUser, setToken, logoutUser } = authorSlice.actions;
export const {reducer:authorReducer}=authorSlice
