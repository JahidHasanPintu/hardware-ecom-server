const express = require("express");
const router = express.Router();


// router.route("/").get(getAllUsers);
router.route("/register").post(registerUser);

// router.route("/:id").get(getUserByID);
// router.route("/:id").delete(removetUser);
// router.route("/:id").put(updateUser);

module.exports = router;