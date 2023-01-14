const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addOvertimeRequest,
  getOvertimeRequest,
  editOvertimeRequest,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addOvertimeRequest);
router.put("/:id", authenticationToken, editOvertimeRequest);
// router.get("/:id", detailDepartement);
router.get("/", authenticationToken, getOvertimeRequest);
// router.post("/login", loginCompany);
module.exports = router;
