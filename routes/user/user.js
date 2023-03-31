const express = require("express");
const router = express.Router();
const {getAllUsers, getUserByID, addUser, removeUser, updateUser, login, blockUnblock} = require("../../controllers/user/user");
const { verifyToken } = require("../../middlewares/verifyToken");
const { upload } = require("../../controllers/uploader");

router.route("/").get(verifyToken,getAllUsers);
router.route("/create").post(upload.single('image'),addUser);
router.route("/login").post(login);
router.route("/:id").get(getUserByID);
router.route("/:id").delete(removeUser);
router.route("/:id").put(updateUser);
router.route("/blocking/:id").put(blockUnblock);

module.exports = router;