const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { getEmploymentOffday } = require("./controller");
const router = express.Router();

// router.post("/", authenticationToken, addOvertimeRequest);
// router.put("/:id", authenticationToken, editOvertimeRequest);
// router.get("/:id", detailDepartement);
router.get("/:id", authenticationToken, getEmploymentOffday);
// router.post("/login", loginCompany);
module.exports = router;
