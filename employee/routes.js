const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addEmployement, getEmployment } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addEmployement);
router.get("/", authenticationToken, getEmployment);
module.exports = router;
