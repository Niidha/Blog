import { BrowserRouter, Route, Routes } from "react-router"
import BlogForm from "../pages/author/blogform"
import BlogList from "../pages/user/bloglist"
import Login from "../pages/author/login"
import Signup from "../pages/author/signin"
import { ProtectedRoute } from "./protectedRoute"
import ViewBlog from "../pages/user/viewblog"
import BlogsByAuthor from "../pages/author/viewMyblog"


const Router = () => {
    return <BrowserRouter>
        <Routes>
            
                <Route path="/create" element={<ProtectedRoute><BlogForm/></ProtectedRoute>} />
                <Route path="/myblogs" element={<ProtectedRoute><BlogsByAuthor/></ProtectedRoute>} />
                <Route path="/" element={<BlogList/>} />
                <Route path="/viewblog/:id" element={<ViewBlog/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
              
        </Routes>
    </BrowserRouter>
}

export default Router