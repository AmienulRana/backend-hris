const Employment = require("./model");

module.exports = {
  addEmployement: async (req, res) => {
    try {
      const { role } = req.admin;
      const {
        emp_profile,
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
        attadence,
        basic_sallary,
      } = req.body;
      if (role === "Super Admin") {
        const newEmployment = new Employment({
          company_id: req.query.company,
          emp_profile,
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
          emp_attadance: attadence,
        });
        await newEmployment.save();
        res
          .status(200)
          .json({ message: "Successfully created a new Employment" });
      } else if (role === "App Admin") {
        const newEmployment = new Employment({
          company_id: req.admin.company_id,
          emp_profile,
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
          emp_attadance: attadence,
        });
        await newEmployment.save();
        res.json({ message: "Successfully created a new Employment" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Add new Employment" });
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
            .select("company_id emp_fullname emp_desid emp_depid emp_status ")
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
};
