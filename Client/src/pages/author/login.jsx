import React from 'react'
import { useFormik } from "formik"

import { useNavigate } from 'react-router'
import {useDispatch} from "react-redux"
import toast from 'react-hot-toast'
import { createUser } from '../redux/authorSlice'
import { api } from '../../axios'

const Login = () => {

    const navigate=useNavigate()
    const dispatch=useDispatch()
    const formik = useFormik({
        initialValues: {
           
            username: "",
            password: ""
           
        },
        
        onSubmit: async (values) => {
            try {
                const { data } = await api.get("/author/login", {params:values})
                localStorage.setItem("access_token", data.token)
                dispatch(createUser(data.user))
                toast.success("Logged In")
                navigate("/")
            } catch (err) {
                console.log(err.message)
            }
        }
    })

    return (
        <div className='d-flex justify-content-center mt-4'>
            <form onSubmit={formik.handleSubmit} className='w-100 d-flex flex-column gap-2'>
              
                <input onChange={formik.handleChange} value={formik.values.username} className='p-2' style={{outline: 0}} type="text" name='username' placeholder='Enter username'/>
                <input onChange={formik.handleChange} value={formik.values.password} className='p-2' style={{outline: 0}} type="password" name='password' placeholder='Enter password'/>
               
                <button className='btn btn-success w-100' type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login