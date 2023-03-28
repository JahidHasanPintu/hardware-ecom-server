const express = require("express");
const router = express.Router();
const { addCategory, getAllCategories, getCategoryByID, removeCategory, updateCategory } = require("../../controllers/categories/categories");
const { upload } = require("../../controllers/uploader");



router.route("/").get(getAllCategories);
router.route("/create").post(upload.single('cat_image'),addCategory);
router.route("/:id").get(getCategoryByID);
router.route("/:id").delete(removeCategory);
router.route("/:id").put(upload.single('cat_image'),updateCategory) ;

module.exports = router;