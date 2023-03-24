const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  generatePayrun,
  getPayrun,
  editStatusPayrun,
  recalculatePayrun,
  editDataPayslip,
  handleUploadFile,
} = require("./controller");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files");
  },
  filename: function (req, file, cb) {
    // You could rename the file name
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

router.post("/", authenticationToken, generatePayrun);
router.post(
  "/upload-pdf/:id",
  authenticationToken,
  upload.single("file"),
  handleUploadFile
);
router.put("/:id", authenticationToken, editStatusPayrun);
router.put("/recalculate/:id", authenticationToken, recalculatePayrun);
router.put("/data/:id", authenticationToken, editDataPayslip);
// router.delete("/:id", authenticationToken, deleteSalary);
router.get("/", authenticationToken, getPayrun);
// router.get("/status", authenticationToken, getPeriodicActive);
module.exports = router;
