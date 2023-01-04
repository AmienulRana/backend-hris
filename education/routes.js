const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addNewEducation,
  getEducation,
  editEducation,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewEducation);
router.put("/:id", authenticationToken, editEducation);
// router.get("/:id", detailDepartement);
router.get("/", authenticationToken, getEducation);
// router.post("/login", loginCompany);
module.exports = router;
