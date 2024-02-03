const express = require("express");
const router = express.Router();
const {getAllUsers, getUserByID, addUser, removeUser, updateUser, login, blockUnblock, getUserByEmail} = require("../../controllers/user/user");
const { verifyToken } = require("../../middlewares/verifyToken");
const { upload } = require("../../controllers/uploader");

router.route("/").get(verifyToken,getAllUsers);
router.route("/create").post(upload.single('image'),addUser);
router.route("/login").post(login);
router.route("/email").get(getUserByEmail);
router.route("/:id").get(getUserByID);
router.route("/:id").delete(removeUser);
router.route("/:id").put(upload.single('image'),updateUser);
router.route("/blocking/:id").put(blockUnblock);

module.exports = router;