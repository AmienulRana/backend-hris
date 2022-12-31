const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./database");
const companyRoute = require("./company/routes");
const adminRoute = require("./admin/routes");
const departementRoute = require("./departement/routes");
const designationRoute = require("./designations/routes");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "public/uploads")));

const api_version = "api/v1";
app.get(`${api_version}/`, (req, res) =>
  res.json({ message: "Welcome to Avapps API" })
);

app.use(`/${api_version}/admin`, adminRoute);
app.use(`/${api_version}/company`, companyRoute);
app.use(`/${api_version}/departement`, departementRoute);
app.use(`/${api_version}/designation`, designationRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server start running on port ${process.env.PORT}`);
});
