import React from 'react';
import { useFormik } from "formik";
import { useNavigate } from 'react-router';
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import { createUser, setToken } from '../redux/authorSlice';
import { api } from '../../axios';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        onSubmit: async (values) => {
            try {
                const { data } = await api.post("/author/login", values);
                const { userId, token, user } = data;

                console.log("Token received:", token);

                // Store in Redux
                dispatch(createUser(user)); 
                dispatch(setToken(token));

                toast.success("Logged In Successfully!");

                // Navigate based on role
                if (user.role === 'admin') {
                    navigate('/admindashboard');
                } else {
                    navigate('/myblogs');
                }

            } catch (err) {
                console.error("Login Error:", err.response?.data?.message || err.message);
                toast.error("Login failed! Check credentials.");
            }
        }
    });

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form 
                onSubmit={formik.handleSubmit} 
                className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                
                <input 
                    onChange={formik.handleChange} 
                    value={formik.values.username} 
                    className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    type="text" 
                    name="username" 
                    placeholder="Enter username"
                />

                <input 
                    onChange={formik.handleChange} 
                    value={formik.values.password} 
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    type="password" 
                    name="password" 
                    placeholder="Enter password"
                />

                <button 
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300" 
                    type="submit"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
