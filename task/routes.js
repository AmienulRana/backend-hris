const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addNewTask } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewTask);
module.exports = router;
