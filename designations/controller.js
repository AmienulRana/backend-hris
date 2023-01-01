const Designation = require("./model");

module.exports = {
  addNewDesignation: async (req, res) => {
    try {
      const { dep_name, dep_desc } = req.body;
      const { role } = req.admin;
      if (role === "Super Admin") {
        const newDesignation = new Designation({
          company_id: req.query.company,
          des_name: dep_name,
          dep_desc: dep_desc,
          des_employee_total: 0,
        });
        await newDesignation.save();
        res
          .status(200)
          .json({ message: "Successfully created a new Designation" });
      } else if (role === "App Admin") {
        const newDesignation = new Designation({
          company_id: req.admin.company_id,
          des_name: dep_name,
          dep_desc: dep_desc,
          des_employee_total: 0,
        });
        await newDesignation.save();
        res.json({ message: "Successfully created a new Designation" });
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
        }).populate({ path: "company_id", select: "company_name" });
        res.status(200).json(designation);
      }
      if (company_id) {
        const designation = await Designation.find({ company_id }).populate({
          path: "company_id",
          select: "company_name",
        });
        res.status(200).json(designation);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Designation" });
    }
  },
};
