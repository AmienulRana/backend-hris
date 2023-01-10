const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addNewShift } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewShift);
module.exports = router;
