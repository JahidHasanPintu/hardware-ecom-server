const express = require("express");
const router = express.Router();
const { addCategory, getAllCategories, getCategoryByID, removetCategory, updateCategory } = require("../../controllers/categories/categories");
const { upload } = require("../../controllers/uploader");



router.route("/").get(getAllCategories);
router.route("/create").post(upload.single('cat_image'),addCategory);
router.route("/:id").get(getCategoryByID);
router.route("/:id").delete(removetCategory);
router.route("/:id").put(updateCategory) ;

module.exports = router;