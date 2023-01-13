const AssignLeave = require("./model");

module.exports = {
  addLeaveRequest: async (req, res) => {
    try {
      const {
        emp_id,
        empleave_type_id,
        empleave_leave_type,
        empleave_start_date,
        empleave_end_date,
        empleave_leave_duration,
        empleave_apply_date,
        empleave_reason,
        empleave_status,
        empleave_start_hours,
        empleave_end_hours,
      } = req.body;
      const { role } = req.admin;
      if (role === "Super Admin" || role === "App Admin") {
        const assignLeave = new AssignLeave({
          company_id:
            role === "Super Admin"
              ? req.query.company_id
              : req.admin.company_id,
          emp_id,
          empleave_type_id,
          empleave_leave_type,
          empleave_start_date,
          empleave_end_date,
          empleave_leave_duration,
          empleave_apply_date,
          empleave_reason,
          empleave_status,
          empleave_start_hours,
          empleave_end_hours,
        });
        await assignLeave.save();
        return res
          .status(200)
          .json({ message: "Successfully created a Assign Leave" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to Add new departement" });
    }
  },
  editStatusLeaveRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req?.admin;
      if (role === "Super Admin" || role === "App Admin") {
        const assignLeave = await AssignLeave.updateOne(
          { _id: id },
          {
            $set: {
              empleave_status: req.body.empleave_status,
            },
          }
        );
        if (assignLeave.modifiedCount > 0) {
          return res.status(200).json({
            message: `Successfully updated status to ${req.body.empleave_status}`,
          });
        }
        return res.status(422).json({ message: "No Data Changed" });
      } else {
        return res.status(422).json({ message: "You can't change status" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to edited status" });
    }
  },
  getLeaveRequest: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin"
          ? req?.query?.company_id
          : req?.admin?.company_id;
      if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
        const leaveRequest = await AssignLeave.find({ company_id }).populate({
          path: "emp_id",
          select: "emp_fullname _id emp_depid",
          populate: {
            path: "emp_depid",
            select: "dep_name",
          },
        });

        res.status(200).json(leaveRequest);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Departement" });
    }
  },
  detailDepartement: async (req, res) => {
    try {
      const { id } = req?.params;
      const departemen = await Departement.findOne({
        _id: id,
      });
      res.status(200).json(departemen);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Departement" });
    }
  },
};
