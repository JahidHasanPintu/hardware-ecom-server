const express = require("express");
const router = express.Router();
const { getAllBrands, addBrand, getBrandByID, removeBrand, updateBrand } = require("../../controllers/brand/brand");
const { getAllProducts, getProductByID, removeProduct, updateProduct, addProduct } = require("../../controllers/products/products");
const { upload } = require("../../controllers/uploader");


router.route("/").get(getAllProducts);
// router.route("/create").post(upload.single('brand_image'),addBrand);
router.route("/create").post(addProduct);
router.route("/:id").get(getProductByID);
router.route("/:id").delete(removeProduct);
router.route("/:id").put(updateProduct) ;

module.exports = router;