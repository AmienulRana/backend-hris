const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addNewShift, getShift, changeStatusShift } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewShift);
router.get("/", authenticationToken, getShift);
router.put("/status/:id", authenticationToken, changeStatusShift);
module.exports = router;
