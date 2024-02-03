const express = require("express");
const { getAllOrders, addOrder, getOrderByID, removeOrder, updateOrder, getOrderByUser, getOrderByOrderID, getAllStats } = require("../../controllers/orders/orders");


const router = express.Router();


router.route("/").get(getAllOrders);
router.route("/stats").get(getAllStats);
router.route("/create").post(addOrder);
router.route("/invoice").get(getOrderByOrderID);
router.route("/:id").get(getOrderByID);
router.route("/user/:userId").get(getOrderByUser);
router.route("/:id").delete(removeOrder);
router.route("/:id").put(updateOrder) ;

module.exports = router;