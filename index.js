const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./database");
const companyRoute = require("./company/routes");
const adminRoute = require("./admin/routes");
const departementRoute = require("./departement/routes");
const designationRoute = require("./designations/routes");
const employmentRoute = require("./employee/routes");
const EducationRoute = require("./education/routes");
const ExperienceRoute = require("./experience/routes");
const BankRoute = require("./bank/routes");
const SalaryRoute = require("./salary/routes");
const ShiftRoute = require("./workshift/routes");
const AllowDeductRoute = require("./allow-deduction/routes");
const AllowanceEmployment = require("./emp-allowance/routes");
const DeductionEmployment = require("./emp-deduction/routes");
const LeaveRequestRoute = require("./leave-request/routes");
const EmploymentStatusRoute = require("./emp-status/routes");
const OvertimeRequestRoute = require("./overtime-request/routes");
const path = require("path");
const LeaveRoute = require("./leave-holidays/routes");
const router = express.Router();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "public/uploads")));

const api_version = "api/v1";
app.use(
  `/`,
  router.get("/", (req, res) => res.json({ message: "Welcome to Avapps API" }))
);

app.use(`/${api_version}/admin`, adminRoute);
app.use(`/${api_version}/company`, companyRoute);
app.use(`/${api_version}/departement`, departementRoute);
app.use(`/${api_version}/designation`, designationRoute);
app.use(`/${api_version}/employment`, employmentRoute);
app.use(`/${api_version}/education`, EducationRoute);
app.use(`/${api_version}/experience`, ExperienceRoute);
app.use(`/${api_version}/bank`, BankRoute);
app.use(`/${api_version}/salary`, SalaryRoute);
app.use(`/${api_version}/allowance-deduction`, AllowDeductRoute);
app.use(`/${api_version}/allowance`, AllowanceEmployment);
app.use(`/${api_version}/deduction`, DeductionEmployment);
app.use(`/${api_version}/shift`, ShiftRoute);
app.use(`/${api_version}/leave-holiday`, LeaveRoute);
app.use(`/${api_version}/leave-request`, LeaveRequestRoute);
app.use(`/${api_version}/employment-status`, EmploymentStatusRoute);
app.use(`/${api_version}/overtime-request`, OvertimeRequestRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server start running on port ${process.env.PORT}`);
});
