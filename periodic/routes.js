const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addNewPeriodic,
  getPeriodic,
  editStatus,
  getPeriodicActive,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewPeriodic);
router.put("/:id", authenticationToken, editStatus);
// router.delete("/:id", authenticationToken, deleteSalary);
router.get("/", authenticationToken, getPeriodic);
router.get("/status", authenticationToken, getPeriodicActive);
module.exports = router;
