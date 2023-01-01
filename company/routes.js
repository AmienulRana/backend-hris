const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  registerCompany,
  loginCompany,
  getAllCompany,
} = require("./controller");
const router = express.Router();

router.post("/registrasi", registerCompany);
router.post("/login", loginCompany);
router.get("/all", getAllCompany);
module.exports = router;
