const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addLeaveRequest,
  getLeaveRequest,
  // getDepartement,
  // editDepartement,
  // detailDepartement,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addLeaveRequest);
// router.put("/:id", authenticationToken, editDepartement);
// router.get("/:id", detailDepartement);
router.get("/", authenticationToken, getLeaveRequest);
// router.post("/login", loginCompany);
module.exports = router;
