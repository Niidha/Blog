import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, auth = false }) => {
    const token = localStorage.getItem("access_token");

    if (auth && !token) {
        // If authentication is required and no token is found, redirect to login
        return <Navigate to="/login" />;
    }

    if (auth && token) {
        // If the page is for unauthenticated users (e.g., login/signup) and user is logged in, redirect to home
        return <Navigate to="/" />;
    }

    // Otherwise, render the requested page
    return children;
};
