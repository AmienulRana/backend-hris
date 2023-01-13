const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addLeaveRequest,
  getLeaveRequest,
  editStatusLeaveRequest,
  // getDepartement,
  // editDepartement,
  // detailDepartement,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addLeaveRequest);
router.put("/status/:id", authenticationToken, editStatusLeaveRequest);
// router.get("/:id", detailDepartement);
router.get("/", authenticationToken, getLeaveRequest);
// router.post("/login", loginCompany);
module.exports = router;
