const Employment = require("./model");
const fs = require("fs");
const Salary = require("../salary/model");

module.exports = {
  addEmployement: async (req, res) => {
    try {
      const { role } = req.admin;
      const {
        username,
        password,
        emp_firstname,
        emp_lastname,
        emp_nikktp,
        email,
        emp_phone,
        emp_gender,
        emp_marital_status,
        emp_birthday,
        emp_blood,
        emp_nik_karyawan,
        emp_depid,
        emp_desid,
        emp_status,
        emp_fsuperior,
        emp_ssuperior,
        emp_location,
        attadance,
        basic_salary,
      } = req.body;
      const parsingtoJson = JSON.parse(basic_salary);
      const newEmployment = new Employment({
        company_id:
          role === "Super Admin"
            ? req.query.company
            : role === "App Admin" && req.admin.company_id,
        emp_profile: req.file ? req.file?.filename : null,
        username,
        password,
        email,
        emp_firstname,
        emp_lastname,
        emp_fullname: `${emp_firstname} ${emp_lastname}`,
        emp_nikktp,
        emp_phone,
        emp_gender,
        emp_marital_status,
        emp_birthday,
        emp_blood,
        emp_nik_karyawan,
        emp_depid,
        emp_desid,
        emp_status,
        emp_fsuperior,
        emp_ssuperior,
        emp_location,
        emp_attadance: JSON.parse(attadance),
      });
      await newEmployment.save().then(async (emp) => {
        if (basic_salary) {
          const salary = new Salary({ ...parsingtoJson, emp_id: emp._id });
          await salary.save();
        }
      });
      return res.json({ message: "Successfully created a new Employment" });
      // return res.status(500).json({ message: "Failed to Add new Employment" });
    } catch (error) {
      console.log(error);
      if (req?.file) {
        console.log(error);
        fs.unlinkSync(`public/uploads/${req.file.filename}`);
      }
      return res.status(500).json({ message: "Failed to Add new Employment" });
    }
  },
  getEmployment: async (req, res) => {
    try {
      const company_id = req?.admin?.company_id;
      if (req.admin.role === "Super Admin") {
        const company_id = req.query.company;
        if (company_id) {
          const employment = await Employment.find({
            company_id,
          })
            .select(
              "company_id emp_fullname emp_desid emp_depid emp_status emp_profile"
            )
            .populate({ path: "company_id", select: "company_name" })
            .populate({ path: "emp_depid", select: "dep_name dep_workshift" })
            .populate({ path: "emp_desid", select: "des_name" });
          return res.status(200).json(employment);
        }
        return res.status(200).json([]);
      }
      if (company_id) {
        const employment = await Employment.find({ company_id })
          .select("company_id emp_fullname emp_desid emp_depid emp_status ")
          .populate({ path: "company_id", select: "company_name" })
          .populate({ path: "emp_depid", select: "dep_name" })
          .populate({ path: "emp_desid", select: "des_name" });
        return res.status(200).json(employment);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Designation" });
    }
  },
  detailEmployment: async (req, res) => {
    try {
      const { id } = req.params;
      const employment = await Employment.findOne({
        _id: id,
      })
        .populate({ path: "company_id", select: "company_name" })
        .populate({ path: "emp_depid", select: "dep_name dep_workshift" })
        .populate({ path: "emp_desid", select: "des_name" });
      return res.status(200).json(employment);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Designation" });
    }
  },
};
