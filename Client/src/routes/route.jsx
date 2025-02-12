import { BrowserRouter, Route, Routes } from "react-router"
import BlogForm from "../pages/author/blogform"
import BlogList from "../pages/user/bloglist"
import Login from "../pages/author/login"
import Signup from "../pages/author/signin"
import { ProtectedRoute } from "./protectedRoute"
import ViewBlog from "../pages/user/viewblog"
import BlogsByAuthor from "../pages/author/viewMyblog"
import ProfilePage from "../pages/author/Profile"
import UpdateBlog from "../pages/author/editBlog"

import AuthorDetails from "../pages/user/authorprofile"


const Router = () => {
    return <BrowserRouter>
        <Routes>
            
                <Route path="/create" element={<BlogForm/>} />
                <Route path="/myblogs" element={<ProtectedRoute><BlogsByAuthor/></ProtectedRoute>} />
                <Route path="/profile" element={<ProfilePage/>} />
                <Route path="/" element={<BlogList/>} />
                <Route path="/editblog/:id" element={<UpdateBlog/>} />
                <Route path="/viewblog/:id" element={<ViewBlog/>} />
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={ <Signup/>} />
                <Route path="/details/:username" element={ <AuthorDetails/>} />
              
        </Routes>
    </BrowserRouter>
}

export default Router