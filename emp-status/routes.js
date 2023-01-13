const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addStatus, getStatus, editStatus } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addStatus);
router.put("/:id", authenticationToken, editStatus);
router.get("/", authenticationToken, getStatus);
module.exports = router;
