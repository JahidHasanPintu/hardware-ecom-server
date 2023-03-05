const express = require("express");
const { getAllBlogs, getBlogByID, removetBlog, updateBlog, addBlog } = require("../../controllers/blogs/blogs");

const router = express.Router();


router.route("/").get(getAllBlogs);
router.route("/create").post(addBlog);
router.route("/:id").get(getBlogByID);
router.route("/:id").delete(removetBlog);
router.route("/:id").put(updateBlog) ;

module.exports = router;