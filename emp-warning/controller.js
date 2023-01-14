const EmpWarning = require("./model");

module.exports = {
  addWarning: async (req, res) => {
    try {
      const { role } = req.admin;
      if (role === "Super Admin" || role === "App Admin") {
        const add_emp_status = new EmpWarning({
          company_id:
            role === "Super Admin"
              ? req.query.company_id
              : req.admin.company_id,
          ...req.body,
        });
        await add_emp_status.save();
        return res
          .status(200)
          .json({ message: "Succesfully add new warning employment" });
      }
    } catch (error) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to add new warning | Server Error" });
    }
  },
  editWarning: async (req, res) => {
    try {
      const {
        empwarning_type,
        empwarning_subject,
        empwarning_date,
        empwarning_desc,
        empwarning_status,
      } = req.body;
      const { role } = req.admin;
      if (role === "Super Admin" || role === "App Admin") {
        const edit_emp_status = await EmpWarning.updateOne(
          { _id: req.params.id },
          {
            $set: {
              empwarning_type,
              empwarning_subject,
              empwarning_date,
              empwarning_desc,
              empwarning_status,
            },
          }
        );
        if (edit_emp_status.modifiedCount > 0) {
          return res.status(200).json({ message: "Succesfully edited data" });
        }
        return res.status(422).json({ message: "No data Changed" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to edited data | Server Error" });
    }
  },
  getWarning: async (req, res) => {
    try {
      const { role } = req.admin;
      if (role === "Super Admin" || "App Admin") {
        const get_emp_warning = await EmpWarning.find({
          company_id:
            role === "Super Admin"
              ? req.query.company_id
              : req.admin.company_id,
        })
          .populate({
            path: "emp_id",
            select: "emp_fullname",
          })
          .populate({
            path: "company_id",
            select: "company_name",
          });
        return res.status(200).json(get_emp_warning);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to get warning data | Server Error" });
    }
  },
  deleteWarning: async (req, res) => {
    try {
      const { role } = req.admin;
      if (role === "Super Admin" || role === "App Admin") {
        const delete_emp_status = await EmpWarning.deleteOne({
          _id: req.params.id,
        });
        if (delete_emp_status.deletedCount > 0) {
          return res.status(200).json({ message: "Succesfully deleted data" });
        }
        return res.status(422).json({ message: "No data deleted" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Failed to deleted data | Server Error" });
    }
  },
};
