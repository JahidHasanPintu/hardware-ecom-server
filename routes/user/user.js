const express = require("express");
const router = express.Router();
const {getAllUsers, getUserByID, addUser} = require("../../controllers/user/user");


router.route("/").get(getAllUsers);
router.route("/create").post(addUser);
router.route("/:id").get(getUserByID);

module.exports = router;