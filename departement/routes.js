const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addNewDepartement, getDepartement } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewDepartement);
router.get("/", authenticationToken, getDepartement);
// router.post("/login", loginCompany);
module.exports = router;
