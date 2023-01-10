const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addNewShift, getShift } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewShift);
router.get("/", authenticationToken, getShift);
module.exports = router;
