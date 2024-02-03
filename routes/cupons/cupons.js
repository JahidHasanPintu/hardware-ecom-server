const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/verifyToken");
const { getAllCupons, addCupon, getCuponByID, removeCupon, updateCupon, useCoupon, addOfferDate, updateOfferDate, getOfferDate } = require("../../controllers/cupons/cupons");

router.route("/").get(verifyToken,getAllCupons);
router.route("/create").post(addCupon);


router.route("/offer").get(getOfferDate);
router.route("/offer/create").post(addOfferDate);
router.route("/offer/:id").put(updateOfferDate);


router.route("/use").get(useCoupon);
router.route("/:id").get(getCuponByID);
router.route("/:id").delete(removeCupon);
router.route("/:id").put(updateCupon);



module.exports = router;