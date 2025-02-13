import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, auth = false }) => {
    const token = localStorage.getItem("access_token");

    if (auth && !token) {
   
        return <Navigate to="/login" />;
    }

    if (auth && token) {
        
        return <Navigate to="/" />;
    }

    
    return children;
};
