import { createSlice } from "@reduxjs/toolkit";

// Retrieve stored user data safely
const storedUserData = localStorage.getItem("user");
const storedUser = storedUserData && storedUserData !== "undefined" ? JSON.parse(storedUserData) : null;

const storedToken = localStorage.getItem("access_token") || null;
const storedRole = localStorage.getItem("role") || (storedUser ? storedUser.role : null);

const authorSlice = createSlice({
    name: "author",
    initialState: {
        user: storedUser,
        token: storedToken,
        role: storedRole,  // Store role in state
    },
    reducers: {
        createUser: (state, action) => {
            state.user = action.payload;
            state.role = action.payload.role;  // Set role
            localStorage.setItem("user", JSON.stringify(action.payload));
            localStorage.setItem("role", action.payload.role);
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("access_token", action.payload);
        },
        setRole: (state, action) => {
            state.role = action.payload;
            localStorage.setItem("role", action.payload);
        },
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            localStorage.removeItem("role");
        },
    },
});

export const { createUser, setToken, setRole, logoutUser } = authorSlice.actions;
export const { reducer: authorReducer } = authorSlice;
