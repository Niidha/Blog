import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_ORIGIN || "http://localhost:9090",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization; 
    }

    return config;
});
