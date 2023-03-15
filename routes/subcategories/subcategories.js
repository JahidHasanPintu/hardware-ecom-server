const express = require("express");
const { getAllSubCategories, addSubCategory, getSubCategoryByID, removetSubCategory, updateSubCategory } = require("../../controllers/subcategories/subcategories");
const router = express.Router();


router.route("/").get(getAllSubCategories);
router.route("/create").post(addSubCategory);
router.route("/:id").get(getSubCategoryByID);
router.route("/:id").delete(removetSubCategory);
router.route("/:id").put(updateSubCategory) ;

module.exports = router;