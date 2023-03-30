const express = require("express");
const { getAllSubCategories, addSubCategory, getSubCategoryByID, removeSubCategory, updateSubCategory } = require("../../controllers/subcategories/subcategories");
const { upload } = require("../../controllers/uploader");
const router = express.Router();


router.route("/").get(getAllSubCategories);
router.route("/create").post(upload.single('subcat_image'),addSubCategory);
router.route("/:id").get(getSubCategoryByID);
router.route("/:id").delete(removeSubCategory);
router.route("/:id").put(upload.single('subcat_image'),updateSubCategory) ;


module.exports = router;