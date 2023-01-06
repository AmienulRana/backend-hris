const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  registerCompany,
  loginCompany,
  getAllCompany,
  dahsboard,
} = require("./controller");
const router = express.Router();

router.post("/registrasi", registerCompany);
router.post("/login", loginCompany);
router.get("/all", getAllCompany);
router.get("/dashboard", dahsboard);
module.exports = router;
