const Designation = require("./model");

module.exports = {
  addNewDesignation: async (req, res) => {
    try {
      const { des_name, des_desc, emp_id } = req.body;
      const { role } = req.admin;
      const company_id =
        role === "Super Admin " || role === "Group Admin"
          ? req.query.company
          : req.admin.company_id;
      // console.log(emp_id);
      if (
        role === "Super Admin" ||
        role === "App Admin" ||
        role === "Group Admin"
      ) {
        const newDesignation = new Designation({
          company_id,
          des_name,
          des_desc,
          emp_id,
          des_employee_total: 0,
        });
        await newDesignation
          .save()
          .then(() => {
            return res
              .status(200)
              .json({ message: "Successfully created a new Designation" });
          })
          .catch((error) => console.log(error));
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Add new Designation" });
    }
  },
  getDesignation: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin " || role === "Group Admin"
          ? req.query.company
          : req.admin.company_id;
      console.log(company_id);
      const designation = await Designation.find({
        company_id,
      })
        .populate({ path: "company_id", select: "company_name" })
        .populate({
          path: "emp_id",
          select: "emp_fullname",
        });
      res.status(200).json(designation);
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
      if (
        role === "Super Admin" ||
        role === "App Admin" ||
        role === "Group Admin"
      ) {
        const designation = await Designation.find({ _id: id });
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
        return res
          .status(200)
          .json({ message: "Successfully updated a new Designation" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to updated Designation" });
    }
  },
  deleteDesignation: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.admin;
      if (
        role === "Super Admin" ||
        role === "App Admin" ||
        role === "Group Admin"
      ) {
        const deleteDes = await Designation.deleteOne({ _id: req.params.id });
        if (deleteDes.deletedCount > 0) {
          return res
            .status(200)
            .json({ message: "Successfully Deleted a Designation" });
        } else {
          return res
            .status(422)
            .json({ message: "Failed Deleted a Designation" });
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to deleted Designation" });
    }
  },
};
