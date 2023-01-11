const Shift = require("./model");

module.exports = {
  addNewShift: async (req, res) => {
    try {
      const {
        shift_name,
        shift_clockin,
        shift_clockout,
        shift_late_tolarance,
        shift_verylate_tolarance,
        shift_break_duration,
      } = req.body;
      const { role } = req.admin;
      if (role === "Super Admin" || "Role" === "App Admin") {
        const shift = new Shift({
          company_id:
            role === "Super Admin"
              ? req.query.company_id
              : req.admin.company_id,
          shift_name,
          shift_clockin,
          shift_clockout,
          shift_late_tolarance,
          shift_verylate_tolarance,
          shift_break_duration,
          shift_desc: `${shift_name} (${shift_clockin}-${shift_clockout}, ${
            shift_break_duration < 10
              ? `0${shift_break_duration}:00 Hour`
              : `${shift_break_duration}:00 Hour`
          })`,
        });
        await shift.save();
        res.status(200).json({ message: "Succesfuly added new shift" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to add shift | server error" });
    }
  },
  getShift: async (req, res) => {
    try {
      const { role } = req.admin;
      if (role === "Super Admin" || "Role" === "App Admin") {
        const shift = await Shift.find({
          company_id:
            role === "Super Admin"
              ? req.query.company_id
              : req.admin.company_id,
        }).populate("company_id");
        res.status(200).json(shift);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to add shift | server error" });
    }
  },
  changeStatusShift: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      if (role === "Super Admin" || role === "App Admin") {
        const findShift = await Shift.findOne({ _id: id });
        const shift = await Shift.updateOne(
          { _id: id },
          {
            $set: {
              shift_status: findShift?.shift_status ? false : true,
            },
          }
        );
        return res.status(200).json({
          message: `Successfully updated status`,
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: `Failed to edit status | Internal Server Error` });
    }
  },
};
