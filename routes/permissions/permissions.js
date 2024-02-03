const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/verifyToken");
const { upload } = require("../../controllers/uploader");
const { getAllPermissions, addPermission, getPermissionByID, removePermission, updatePermission } = require("../../controllers/permissions/permissions");

router.route("/").get(getAllPermissions);
router.route("/create").post(upload.single('image'),addPermission);
router.route("/:id").get(getPermissionByID);
router.route("/:id").delete(removePermission);
router.route("/:id").put(updatePermission);

module.exports = router;