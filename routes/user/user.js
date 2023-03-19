const express = require("express");
const router = express.Router();
const {getAllUsers, getUserByID, addUser, removetUser, updateUser, login, blockUnblock} = require("../../controllers/user/user");
const { verifyToken } = require("../../middlewares/verifyToken");


router.route("/").get(verifyToken,getAllUsers);
router.route("/create").post(addUser);
router.route("/login").post(login);
router.route("/:id").get(getUserByID);
router.route("/:id").delete(removetUser);
router.route("/:id").put(updateUser);
router.route("/blocking/:id").put(blockUnblock);

module.exports = router;