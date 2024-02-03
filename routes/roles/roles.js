const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/verifyToken");
const { upload } = require("../../controllers/uploader");
const { getAllRoles, getRoleByID, removeRole, updateRole, addRole } = require("../../controllers/roles/roles");

router.route("/").get(getAllRoles);
router.route("/create").post(upload.single('image'),addRole);
router.route("/:id").get(getRoleByID);
router.route("/:id").delete(removeRole);
router.route("/:id").put(updateRole);

module.exports = router;