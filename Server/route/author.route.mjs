import { Router } from "express";
import { deleteblog, getAllAuthors, getAuthorByUsername,  getBlogByAuthor,  login, signUp, updateAuthorByUsername } from "../controller/author.controller.mjs";
import { getBlogsCountByUsername, PublishBlog,  UnpublishBlog,  updateBlog } from "../controller/post.controller.mjs";
import { Auth } from "../middleware/auth.mjs";
import { upload } from "../middleware/upload.mjs";

const authorRoute = Router();

//  Author Authentication & Profile Management
authorRoute.post("/signup", signUp);
authorRoute.post("/login", login);
authorRoute.get("/details/:username", getAuthorByUsername);
authorRoute.patch("/update/:username", Auth,upload.single("image"), updateAuthorByUsername);
// authorRoute.get("/profileUrl/:userId", getauthorProfileUrl);
authorRoute.get("/", getAllAuthors);

//  Blog Management

authorRoute.put("/editblog/:id", Auth, upload.single("image"), updateBlog);
authorRoute.delete("/delete/:id", Auth, deleteblog);
authorRoute.put("/publish/:id", Auth,PublishBlog);
authorRoute.put("/unpublish/:id", UnpublishBlog);
authorRoute.get("/blogcount/:username", getBlogsCountByUsername);
authorRoute.get("/:username", getBlogByAuthor);




export default authorRoute;
