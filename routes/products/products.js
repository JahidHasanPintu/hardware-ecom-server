const express = require("express");
const router = express.Router();
const { getAllProducts, getProductByID, removeProduct, updateProduct, addProduct, addVariations } = require("../../controllers/products/products");
const { upload } = require("../../controllers/uploader");


router.route("/").get(getAllProducts);
// router.route("/create").post(upload.single('images'),addProduct);
router.route("/create").post(upload.array('images', 4), addProduct);
router.route("/variation/create").post(upload.array('images', 4), addVariations);
router.route("/:id").get(getProductByID);
router.route("/:id").delete(removeProduct);
router.route("/:id").put(upload.array('images', 4),updateProduct) ;

module.exports = router;