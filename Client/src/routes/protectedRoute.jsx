import { Navigate } from "react-router";

export const ProtectedRoute = ({ children, auth = false }) => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role"); // Assuming you store the role in localStorage

    if (!token) {
        return auth ? children : <Navigate to="/login" />;
    } else {
        if (auth) {
            // Redirect based on role
            switch (userRole) {
                case "superadmin":
                    return <Navigate to="/superadmin/dashboard" />;
                case "admin":
                    return <Navigate to="/admin/blogs" />;
                default:
                    return <Navigate to="/create" />; // Default to author
            }
        } else {
            return children;
        }
    }
};
