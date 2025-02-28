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
import AdminBlogList from "../pages/admin/adminblogs"
import AuthorList from "../pages/admin/adminauthorpage"
import AdminNotifications from "../pages/admin/adminnotification"
import AuthorBlogs from "../pages/admin/adminauthorblogs"
import AuthorNotifications from "../pages/author/authornotification"
import AdminReview from "../pages/admin/adminreview"
import AdminDashboard from "../pages/admin/admindashboard"
import AdminManage from "../pages/admin/adminmanageuseradmin"
import AuthorInvitations from "../pages/author/authorinvitations"
import AdminreviewNotifications from "../pages/admin/adminauthorinvite"
import Testimonials from "../pages/admin/admintestimonial"



const Router = () => {
    return <BrowserRouter>
        <Routes>
            
                <Route path="/create" element={<ProtectedRoute allowedRoles={["author"]}><BlogForm/></ProtectedRoute>} />
                <Route path="/myblogs" element={<ProtectedRoute allowedRoles={["author","admin"]}><BlogsByAuthor/></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute allowedRoles={["author"]}><ProfilePage/></ProtectedRoute>} />
                <Route path="/authornotification" element={<ProtectedRoute allowedRoles={["author"]}><AuthorNotifications/></ProtectedRoute>} />
                <Route path="/" element={<BlogList/>} />
                <Route path="/editblog/:id" element={<ProtectedRoute allowedRoles={["author"]}><UpdateBlog/></ProtectedRoute>} />
                <Route path="/viewblog/:id" element={<ViewBlog/>} />
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={ <Signup/>} />
                <Route path="/details/:username" element={ <AuthorDetails/>} />
                <Route path="/authorinvitation" element={ <AuthorInvitations/>} />
                
                <Route path="/adminblog" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminBlogList/></ProtectedRoute>} />
                <Route path="/adminnotification" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminNotifications/></ProtectedRoute>} />
                <Route path="/adminauthors" element={ <ProtectedRoute allowedRoles={["admin"]}><AuthorList/></ProtectedRoute>} />
                <Route path="/author/:username" element={<ProtectedRoute allowedRoles={["admin"]}> <AuthorBlogs/></ProtectedRoute>} />
                <Route path="/adminreview" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminReview/></ProtectedRoute>} />
                <Route path="/admindashboard" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminDashboard/></ProtectedRoute>} />
                <Route path="/adminmanage" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminManage/></ProtectedRoute>} />
                <Route path="/admininviteresponse" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminreviewNotifications/></ProtectedRoute>} />
                <Route path="/admintestimonial" element={<ProtectedRoute allowedRoles={["admin"]}> <Testimonials/></ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
}

export default Router