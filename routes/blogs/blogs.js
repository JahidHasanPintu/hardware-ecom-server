const express = require("express");
const { getAllBlogs, getBlogByID, removeBlog, updateBlog, addBlog } = require("../../controllers/blogs/blogs");

const router = express.Router();


router.route("/").get(getAllBlogs);
router.route("/create").post(addBlog);
router.route("/:id").get(getBlogByID);
router.route("/:id").delete(removeBlog);
router.route("/:id").put(updateBlog) ;

module.exports = router;