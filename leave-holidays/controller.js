const LeaveHoliday = require("./model");

module.exports = {
  addNewLeaveHoliday: async (req, res) => {
    try {
      const {
        leavehol_startdate,
        leavehol_enddate,
        leavehol_desc,
        leavehol_type,
        leavehol_cutleave,
        leavehol_depid,
      } = req.body;
      const { role } = req.admin;
      if (role === "Super Admin" || role === "App Admin") {
        const leaveHol = new LeaveHoliday({
          company_id:
            role === "Super Admin"
              ? req.query.company_id
              : req.admin.company_id,
          leavehol_startdate,
          leavehol_enddate,
          leavehol_desc,
          leavehol_type,
          leavehol_cutleave,
          leavehol_depid,
        });
        await leaveHol.save();
        const typeLeaveHole =
          leavehol_type === "Cuti Bersama" ? "Joint Leave" : "National Holiday";
        res
          .status(200)
          .json({ message: `Succesfully added new ${typeLeaveHole}` });
      }
    } catch (error) {
      console.log(error);
    }
  },
  getLeaveHoliday: async (req, res) => {
    try {
      const { role } = req.admin;

      if (role === "Super Admin" || role === "App Admin") {
        const leaveHol = await LeaveHoliday.find({
          company_id:
            role === "Super Admin"
              ? req.query.company_id
              : req.admin.company_id,
        }).populate({
          path: "leavehol_depid",
          select: "_id dep_name",
        });
        res.status(200).json(leaveHol);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
