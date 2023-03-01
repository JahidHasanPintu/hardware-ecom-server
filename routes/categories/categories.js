const express = require("express");
const { addCategory, getAllCategories, getCategoryByID, removetCategory, updateCategory } = require("../../controllers/categories/categories");
const router = express.Router();


router.route("/").get(getAllCategories);
router.route("/create").post(addCategory);
router.route("/:id").get(getCategoryByID);
router.route("/:id").delete(removetCategory);
router.route("/:id").put(updateCategory) ;

module.exports = router;