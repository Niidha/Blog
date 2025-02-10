import React from 'react';
import { useFormik } from 'formik';
import { api } from '../../axios';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { createUser } from '../redux/authorSlice';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            name: '',
            username: '',
            email: '',
            phone: '',
            password: '',
            confirm_password: ''
        },
        
        onSubmit: async (values) => {
            try {
                const { data } = await api.post('/author/signup', values);
                console.log(data.token);
                localStorage.setItem('access_token', data.token);
                dispatch(createUser(data.user));
                toast.success('Account Created');
                navigate('/create');
            } catch (err) {
                toast.error(err.response?.data.message || err.message);
                console.log(err.message);
            }
        }
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form 
                onSubmit={formik.handleSubmit} 
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Sign Up</h2>
                <input 
                    onChange={formik.handleChange} 
                    value={formik.values.name} 
                    className="w-full p-3 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    type="text" name="name" 
                    placeholder="Enter name"
                />
                <input 
                    onChange={formik.handleChange} 
                    value={formik.values.username} 
                    className="w-full p-3 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    type="text" name="username" 
                    placeholder="Enter username"
                />
                <input 
                    onChange={formik.handleChange} 
                    value={formik.values.email} 
                    className="w-full p-3 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    type="email" name="email" 
                    placeholder="Enter email"
                />
                <input 
                    onChange={formik.handleChange} 
                    value={formik.values.phone} 
                    className="w-full p-3 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    type="text" name="phone" 
                    placeholder="Enter phone number"
                />
                <input 
                    onChange={formik.handleChange} 
                    value={formik.values.password} 
                    className="w-full p-3 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    type="password" name="password" 
                    placeholder="Enter password"
                />
                <input 
                    onChange={formik.handleChange} 
                    value={formik.values.confirm_password} 
                    className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    type="password" name="confirm_password" 
                    placeholder="Re-enter password"
                />
                <button 
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    type="submit"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default Signup;
