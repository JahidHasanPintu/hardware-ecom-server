const express = require("express");
const { getAllOrders, addOrder, getOrderByID, removeOrder, updateOrder } = require("../../controllers/orders/orders");


const router = express.Router();


router.route("/").get(getAllOrders);
router.route("/create").post(addOrder);
router.route("/:id").get(getOrderByID);
router.route("/:id").delete(removeOrder);
router.route("/:id").put(updateOrder) ;

module.exports = router;