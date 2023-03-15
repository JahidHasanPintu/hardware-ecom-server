const express = require("express");
const router = express.Router();
const { getAllBrands, addBrand, getBrandByID, removetBrand, updateBrand } = require("../../controllers/brand/brand");
const { upload } = require("../../controllers/uploader");


router.route("/").get(getAllBrands);
router.route("/create").post(upload.single('brand_image'),addBrand);
router.route("/:id").get(getBrandByID);
router.route("/:id").delete(removetBrand);
router.route("/:id").put(updateBrand) ;

module.exports = router;