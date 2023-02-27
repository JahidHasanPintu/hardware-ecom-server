const express = require("express");
const router = express.Router();
const {getAllUsers, getUserByID, addUser, removetUser, updateUser} = require("../../controllers/user/user");


router.route("/").get(getAllUsers);
router.route("/create").post(addUser);
router.route("/:id").get(getUserByID);
router.route("/:id").delete(removetUser);
router.route("/:id").put(updateUser);

module.exports = router;