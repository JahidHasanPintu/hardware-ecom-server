const express = require("express");
const router = express.Router();
const { getAllBrands, addBrand, getBrandByID, removeBrand, updateBrand } = require("../../controllers/brand/brand");
const { upload } = require("../../controllers/uploader");


router.route("/").get(getAllBrands);
router.route("/create").post(upload.single('brand_image'),addBrand);
router.route("/:id").get(getBrandByID);
router.route("/:id").delete(removeBrand);
router.route("/:id").put(upload.single('brand_image'),updateBrand) ;

module.exports = router;