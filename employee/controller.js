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
      const checkDuplicateEmail = await Employment.findOne({ email });
      const checkDuplicateNIKKtp = await Employment.findOne({ emp_nikktp });
      const checkDuplicateUsername = await Employment.findOne({ username });
      if (checkDuplicateEmail) {
        return res.status(422).json({
          message: `${email} has been used, please select another email`,
        });
      }
      if (checkDuplicateNIKKtp) {
        return res.status(422).json({
          message: `NIK KTP should not be duplicate, please enter another NIK KTP`,
        });
      }
      if (checkDuplicateUsername) {
        return res.status(422).json({
          message: `${username} has been used, please select another username`,
        });
      }

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
        if (basic_salary.emp_salary && basic_salary.emp_periode) {
          const salary = new Salary({ ...parsingtoJson, emp_id: emp._id });
          await salary.save();
        }
      });
      return res.json({ message: "Successfully created a new Employment" });
      // return res.status(500).json({ message: "Failed to Add new Employment" });
    } catch (error) {
      console.log(error);
      if (req?.file) {
        fs.unlinkSync(`public/uploads/${req.file.filename}`);
      }
      return res.status(500).json({
        message: "Failed to Add new Employment | Internal Server Error",
      });
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
          .populate({ path: "emp_depid", select: "dep_name dep_workshift" })
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
  editPesonalDetail: async (req, res) => {
    try {
      const { role } = req.admin;
      const {
        emp_firstname,
        emp_lastname,
        emp_nikktp,
        email,
        emp_phone,
        emp_gender,
        emp_marital_status,
        emp_birthday,
        emp_blood,
      } = req.body;
      const { id } = req.params;
      const findEmployment = await Employment.findOne({ _id: id });
      // cek duplicate jika employment memperbarui email
      if (email !== findEmployment?.email) {
        const findDuplicateEmail = await Employment.findOne({ email });
        if (!findDuplicateEmail) {
          const newEmployment = await Employment.updateOne(
            { _id: id },
            {
              $set: {
                emp_profile: req.file
                  ? req.file?.filename
                  : findEmployment.emp_profile,
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
              },
            }
          );
          if (newEmployment.modifiedCount > 0) {
            return res.json({
              message: "Successfully updated this Employment",
            });
          } else {
            return res.json({ message: "No data changed" });
          }
        } else {
          return res
            .status(422)
            .json({ message: "Failed to update, Your email has been used" });
        }
      } else {
        const newEmployment = await Employment.updateOne(
          { _id: id },
          {
            $set: {
              emp_profile: req.file
                ? req.file?.filename
                : findEmployment.emp_profile,
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
            },
          }
        );
        if (newEmployment.modifiedCount > 0) {
          return res.json({ message: "Successfully updated Employment" });
        } else {
          return res.json({ message: "No data changed" });
        }
      }
      // return res.status(500).json({ message: "Failed to Add new Employment" });
    } catch (error) {
      console.log(error);
      if (req?.file) {
        console.log(error);
        fs.unlinkSync(`public/uploads/${req.file.filename}`);
      }
      return res.status(500).json({ message: "Failed to Update Employment" });
    }
  },
  editEmploymentDetail: async (req, res) => {
    try {
      const { role } = req.admin;
      const {
        username,
        emp_nik_karyawan,
        emp_depid,
        emp_desid,
        emp_status,
        emp_tanggungan,
        emp_fsuperior,
        emp_ssuperior,
        emp_location,
      } = req.body;
      const { id } = req.params;
      const findEmployment = await Employment.findOne({ _id: id });
      // cek duplicate jika employment memperbarui email
      if (username !== findEmployment?.username) {
        const findDuplicateUsername = await Employment.findOne({ username });
        if (!findDuplicateUsername) {
          const newEmployment = await Employment.updateOne(
            { _id: id },
            {
              $set: {
                username,
                emp_nik_karyawan,
                emp_depid,
                emp_desid,
                emp_status,
                emp_tanggungan,
                emp_fsuperior,
                emp_ssuperior,
                emp_location,
              },
            }
          );
          if (newEmployment.modifiedCount > 0) {
            return res.json({
              message: "Successfully updated this Employment",
            });
          } else {
            return res.json({ message: "No data changed" });
          }
        } else {
          return res
            .status(422)
            .json({ message: "Failed to update, Your username has been used" });
        }
      } else {
        const newEmployment = await Employment.updateOne(
          { _id: id },
          {
            $set: {
              username,
              emp_nik_karyawan,
              emp_depid,
              emp_desid,
              emp_status,
              emp_tanggungan,
              emp_fsuperior,
              emp_ssuperior,
              emp_location,
            },
          }
        );
        if (newEmployment.modifiedCount > 0) {
          return res.json({ message: "Successfully updated Employment" });
        } else {
          return res.json({ message: "No data changed" });
        }
      }
      // return res.status(500).json({ message: "Failed to Add new Employment" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to Update Employment" });
    }
  },
  editWorkShift: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      if (role === "Super Admin" || "App Admin") {
        const newEmployment = await Employment.updateOne(
          { _id: id },
          {
            $set: {
              emp_attadance: {
                ...req.body,
              },
            },
          }
        );
        if (newEmployment.modifiedCount > 0) {
          return res.json({
            message: "Successfully updated shift this Employment",
          });
        } else {
          return res.json({ message: "No data changed" });
        }
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Failed to Update Shift Employment" });
    }
  },
};
