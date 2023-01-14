const Designation = require("./model");

module.exports = {
  addNewDesignation: async (req, res) => {
    try {
      const { des_name, des_desc, emp_id } = req.body;
      const { role } = req.admin;
      // console.log(emp_id);
      console.log(req.body.emp_id);
      if (role === "Super Admin" || role === "App Admin") {
        const newDesignation = new Designation({
          company_id:
            role === "Super Admin" ? req.query.company : req.admin.company_id,
          des_name,
          des_desc,
          emp_id,
          des_employee_total: 0,
        });
        await newDesignation.save();
        return res
          .status(200)
          .json({ message: "Successfully created a new Designation" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Add new Designation" });
    }
  },
  getDesignation: async (req, res) => {
    try {
      const company_id = req?.admin?.company_id;
      if (req.admin.role === "Super Admin") {
        const company_id = req.query.company;
        const designation = await Designation.find({
          company_id,
        })
          .populate({ path: "company_id", select: "company_name" })
          .populate({
            path: "emp_id",
            select: "emp_fullname",
          });
        res.status(200).json(designation);
      }
      if (company_id) {
        const designation = await Designation.find({ company_id })
          .populate({
            path: "company_id",
            select: "company_name",
          })
          .populate({
            path: "emp_id",
            select: "emp_fullname",
          });
        res.status(200).json(designation);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Designation" });
    }
  },
  editDesignation: async (req, res) => {
    try {
      const { des_name, des_desc, emp_id } = req.body;
      const { id } = req.params;
      const { role } = req.admin;
      console.log(req.body);
      if (role === "Super Admin" || role === "App Admin") {
        const designation = await Designation.find({ _id: id });
        console.log(designation);
        const newDesignation = await Designation.updateOne(
          { _id: id },
          {
            $set: {
              des_name,
              des_desc,
              emp_id,
            },
          }
        );
        console.log(newDesignation);
        return res
          .status(200)
          .json({ message: "Successfully updated a new Designation" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to updated Designation" });
    }
  },
};
