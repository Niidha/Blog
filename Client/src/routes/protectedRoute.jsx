import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, auth = false }) => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!auth) {
        return children;
    }

    // Redirect based on user role
    switch (userRole) {
        case "superadmin":
            return <Navigate to="/superadmin/dashboard" />;
        case "admin":
            return <Navigate to="/admindashboard" />;
        case "author":
            return <Navigate to="/create" />;
        default:
            return <Navigate to="/" />;
    }
};
