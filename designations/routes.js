const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addNewDesignation,
  getDesignation,
  editDesignation,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewDesignation);
router.get("/", authenticationToken, getDesignation);
router.put("/:id", authenticationToken, editDesignation);
// router.post("/login", loginCompany);
module.exports = router;
