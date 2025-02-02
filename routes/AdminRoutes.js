const express = require("express");
const { registerAdmin, loginAdmin, changeAdminPassword } = require("../controllers/AdminController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/change-password", changeAdminPassword);


module.exports = router;
