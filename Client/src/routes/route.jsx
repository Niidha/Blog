import { BrowserRouter, Route, Routes } from "react-router"
import BlogForm from "../pages/author/blogform"
import BlogList from "../pages/user/bloglist"
import Login from "../pages/author/login"
import Signup from "../pages/author/signin"


const Router = () => {
    return <BrowserRouter>
        <Routes>
            
                <Route path="/" element={<BlogForm/>} />
                <Route path="/list" element={<BlogList/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
              
        </Routes>
    </BrowserRouter>
}

export default Router