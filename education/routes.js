const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addNewEducation } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewEducation);
// router.put("/:id", authenticationToken, editDepartement);
// router.get("/:id", detailDepartement);
// router.get("/", authenticationToken, getDepartement);
// router.post("/login", loginCompany);
module.exports = router;
