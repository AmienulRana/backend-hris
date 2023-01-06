const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addEmployement,
  getEmployment,
  detailEmployment,
  editPesonalDetail,
  editEmploymentDetail,
} = require("./controller");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
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
const fileFilter = (req, file, cb) => {
  const typeFile = file.mimetype;
  if (
    typeFile === "image/png" ||
    typeFile === "image/jpg" ||
    typeFile === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    new Error("Yang anda upload bukan gambar!");
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000 },
});

router.post("/", authenticationToken, upload.single("profile"), addEmployement);
router.get("/", authenticationToken, getEmployment);
router.get("/:id", authenticationToken, detailEmployment);
router.put("/personal-detail/:id", authenticationToken, editPesonalDetail);
router.put("/employment-detail/:id", authenticationToken, editEmploymentDetail);
module.exports = router;
