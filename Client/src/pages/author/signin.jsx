import React from 'react'
import { useFormik } from "formik"
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { createUser } from '../redux/authorSlice'
import { api } from '../../axios'

const Signup = () => {

    const navigate=useNavigate()
    const dispatch=useDispatch()

    const formik = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            phone:"",
            password: "",
            confirm_password: ""
        },
        
        onSubmit: async (values) => {
            try {
                const { data } = await api.post("/author/signup", values)
                console.log(data.token)
                localStorage.setItem("access_token", data.token)
                dispatch(createUser(data.user))
                toast.success("Account Created")
                navigate("/")
            } catch (err) {
                toast.error(err.response?.data.message||err.message)
                console.log(err.message)
            }
        }
    })

    return (
        <div className='d-flex justify-content-center mt-4'>
            <form onSubmit={formik.handleSubmit} className='w-100 d-flex flex-column gap-2'>
                <input onChange={formik.handleChange} value={formik.values.name} className='p-2' style={{outline: 0}} type="text" name='name' placeholder='Enter name'/>
                <input onChange={formik.handleChange} value={formik.values.username} className='p-2' style={{outline: 0}} type="text" name='username' placeholder='Enter username'/>
                <input onChange={formik.handleChange} value={formik.values.email} className='p-2' style={{outline: 0}} type="text" name='email' placeholder='Enter email'/>
                <input onChange={formik.handleChange} value={formik.values.phone} className='p-2' style={{outline: 0}} type="text" name='phone' placeholder='Enter Mobile number'/>
                <input onChange={formik.handleChange} value={formik.values.password} className='p-2' style={{outline: 0}} type="password" name='password' placeholder='Enter password'/>
                <input onChange={formik.handleChange} value={formik.values.confirm_password} className='p-2' style={{outline: 0}} type="password" name='confirm_password' placeholder='Re-Enter password'/>
                <button className='btn btn-success w-100' type='submit'>Create Account</button>
            </form>
        </div>
    )
}

export default Signup