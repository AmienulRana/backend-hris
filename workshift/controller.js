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
        shift_status,
        shift_break_duration,
      } = req.body;
      console.log(req.body);
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
        });
        await shift.save();
        res.status(200).json({ message: "Succesfuly added new shift" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to add shift | server error" });
    }
  },
};
