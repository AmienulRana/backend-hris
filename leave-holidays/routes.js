const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addNewLeaveHoliday, getLeaveHoliday } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewLeaveHoliday);
router.get("/", authenticationToken, getLeaveHoliday);
// router.put("/:id", authenticationToken, editExperience);
// router.delete("/:id", authenticationToken, deleteExperience);
// router.get("/", authenticationToken, getExperience);
module.exports = router;
