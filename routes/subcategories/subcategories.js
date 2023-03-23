const express = require("express");
const { getAllSubCategories, addSubCategory, getSubCategoryByID, removeSubCategory, updateSubCategory } = require("../../controllers/subcategories/subcategories");
const router = express.Router();


router.route("/").get(getAllSubCategories);
router.route("/create").post(addSubCategory);
router.route("/:id").get(getSubCategoryByID);
router.route("/:id").delete(removeSubCategory);
router.route("/:id").put(updateSubCategory) ;

module.exports = router;