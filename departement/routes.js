const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addNewDepartement,
  getDepartement,
  editDepartement,
  detailDepartement,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewDepartement);
router.put("/:id", authenticationToken, editDepartement);
router.get("/:id", detailDepartement);
router.get("/", authenticationToken, getDepartement);
// router.post("/login", loginCompany);
module.exports = router;
