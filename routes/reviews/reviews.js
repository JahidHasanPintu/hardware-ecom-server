const express = require("express");
const { getAllReviews, addReview, getReviewByID, getReviewByProdID, removeReview, getReviewByUser } = require("../../controllers/reviews/reviews");

const router = express.Router();


router.route("/").get(getAllReviews);
router.route("/create").post(addReview);
router.route("/:id").get(getReviewByID);
router.route("/user/:userId").get(getReviewByUser);
router.route("/product/:id").get(getReviewByProdID);
router.route("/:id").delete(removeReview);
// router.route("/:id").put(updateReview) ;

module.exports = router;