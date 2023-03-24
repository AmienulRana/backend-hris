const Shift = require("./model");

// function getNumberOfWeek() {
//   let today = new Date();
//   let firstDayOfYear = new Date(today.getFullYear(), 0, 1);
//   let pastDaysOfYear = (today - firstDayOfYear) / 86400000;
//   let weekNumber = Math.ceil(
//     (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
//   );

//   return weekNumber;
// }
function serialToday() {
  let today = new Date();
  let serial = (today - new Date(1900, 0, 1)) / 86400000 + 25569;
  return serial;
}

function weeknum(serial, returnType) {
  let date = new Date((serial - 25569) * 86400000);
  let yearStart = new Date(date.getFullYear(), 0, 1);
  let pastDaysOfYear = (date - yearStart) / 86400000;
  let weekNumber = Math.ceil((pastDaysOfYear + yearStart.getDay() + 1) / 7);

  if (returnType === 2) {
    return weekNumber;
  } else {
    return weekNumber - 1;
  }
}

// function getNumberOfWeek(year, month, day) {
//   let today = new Date(year, month - 1, day);
//   let firstDayOfYear = new Date(today.getFullYear(), 0, 1);
//   let pastDaysOfYear = (today - firstDayOfYear) / 86400000;
//   let weekNumber = Math.ceil(
//     (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
//   );

//   return weekNumber;
// }

module.exports = {
  weeknum,
  serialToday,
  addNewShift: async (req, res) => {
    try {
      const { role } = req.admin;

      const company_id =
        role === "Super Admin " || role === "Group Admin"
          ? req.query.company_id
          : req.admin.company_id;
      if (req.body.shift_type === "Regular") {
        const {
          shift_name,
          shift_clockin,
          shift_clockout,
          shift_late_tolarance,
          shift_verylate_tolarance,
          shift_break_duration,
          shift_type,
        } = req.body;
        // if (role === "Super Admin" || "Role" === "App Admin") {
        const shift = new Shift({
          company_id,
          shift_name,
          shift_clockin,
          shift_clockout,
          shift_late_tolarance,
          shift_verylate_tolarance,
          shift_break_duration,
          shift_type,
          shift_desc: `${shift_name} (${shift_clockin}-${shift_clockout}, ${
            shift_break_duration < 10
              ? `0${shift_break_duration}:00 Hour`
              : `${shift_break_duration}:00 Hour`
          })`,
        });
        await shift.save();
        res.status(200).json({ message: "Succesfuly added new shift" });
      } else {
        const { shift_name, shift_type } = req.body;
        const payload = {
          shift_name,
          shift_type,
          week_active: `minggu_${weeknum(serialToday(), 2)}`,
          shift_clockin:
            req.body[`minggu_${weeknum(serialToday(), 2)}`]?.shift_clockin,
          shift_clockout:
            req.body[`minggu_${weeknum(serialToday(), 2)}`]?.shift_clockout,
          shift_break_duration:
            req.body[`minggu_${weeknum(serialToday(), 2)}`]
              ?.shift_break_duration,
          shift_desc: `${shift_name} (${
            req.body[`minggu_${weeknum(serialToday(), 2)}`]?.shift_clockin
          }-${
            req.body[`minggu_${weeknum(serialToday(), 2)}`]?.shift_clockout
          }, ${
            req.body[`minggu_${weeknum(serialToday(), 2)}`]
              ?.shift_break_duration < 10
              ? `0${
                  req.body[`minggu_${weeknum(serialToday(), 2)}`]
                    ?.shift_break_duration
                }:00 Hour`
              : `${
                  req.body[`minggu_${weeknum(serialToday(), 2)}`]
                    ?.shift_break_duration
                }:00 Hour`
          })`,
          schedule: {
            ...req.body,
          },
        };
        // if (role === "Super Admin" || "Role" === "App Admin") {
        const shift = new Shift({
          company_id,
          ...payload,
        });
        await shift.save();
        res.status(200).json({ message: "Succesfuly Add Shift Schedule" });
      }
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to add shift | server error" });
    }
  },
  getShift: async (req, res) => {
    try {
      console.log();
      // console.log(getNumberOfWeek(2023, 1, 2));
      const { role } = req.admin;
      const company_id =
        role === "Super Admin " || role === "Group Admin"
          ? req.query.company_id
          : req.admin.company_id;
      // if (role === "Super Admin" || "Role" === "App Admin") {
      const shift = await Shift.find({
        company_id,
      }).populate("company_id");
      res.status(200).json(shift);
      // }
    } catch (error) {
      res.status(500).json({ message: "Failed to add shift | server error" });
    }
  },
  changeStatusShift: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
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
      // }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: `Failed to edit status | Internal Server Error` });
    }
  },
  editShift: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin " || role === "Group Admin"
          ? req.query.company_id
          : req.admin.company_id;

      if (req.body.shift_type === "Regular") {
        const {
          shift_name,
          shift_clockin,
          shift_clockout,
          shift_late_tolarance,
          shift_verylate_tolarance,
          shift_break_duration,
          shift_type,
        } = req.body;
        const shift = await Shift.updateOne(
          { _id: req.params.id },
          {
            shift_name,
            shift_clockin,
            shift_clockout,
            shift_late_tolarance,
            shift_verylate_tolarance,
            shift_break_duration,
            shift_type,
            shift_desc: `${shift_name} (${shift_clockin}-${shift_clockout}, ${
              shift_break_duration < 10
                ? `0${shift_break_duration}:00 Hour`
                : `${shift_break_duration}:00 Hour`
            })`,
          }
        );
        return res.status(200).json({ message: "Succesfuly Edit shift" });
      } else {
        const { shift_name, shift_type } = req.body;
        const payload = {
          shift_name,
          shift_type,
          week_active: `minggu_${weeknum(serialToday(), 2)}`,
          shift_clockin:
            req.body[`minggu_${weeknum(serialToday(), 2)}`]?.shift_clockin,
          shift_clockout:
            req.body[`minggu_${weeknum(serialToday(), 2)}`]?.shift_clockout,
          shift_break_duration:
            req.body[`minggu_${weeknum(serialToday(), 2)}`]
              ?.shift_break_duration,
          shift_desc: `${shift_name} (${
            req.body[`minggu_${weeknum(serialToday(), 2)}`]?.shift_clockin
          }-${
            req.body[`minggu_${weeknum(serialToday(), 2)}`]?.shift_clockout
          }, ${
            req.body[`minggu_${weeknum(serialToday(), 2)}`]
              ?.shift_break_duration < 10
              ? `0${
                  req.body[`minggu_${weeknum(serialToday(), 2)}`]
                    ?.shift_break_duration
                }:00 Hour`
              : `${
                  req.body[`minggu_${weeknum(serialToday(), 2)}`]
                    ?.shift_break_duration
                }:00 Hour`
          })`,
          schedule: {
            ...req.body,
          },
        };
        // if (role === "Super Admin" || "Role" === "App Admin") {
        const shift = await Shift.updateOne(
          { _id: req.params.id },
          {
            $set: {
              company_id,
              ...payload,
            },
          }
        );
        return res
          .status(200)
          .json({ message: "Succesfuly Edited Schedule shift" });
        // return res.status(500).json({ message: "Failed to edit shift" });
      }

      // if (role === "Super Admin" || "Role" === "App Admin") {

      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to edit shift | server error" });
    }
  },
  deleteShift: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin " || role === "Group Admin"
          ? req.query.company_id
          : req.admin.company_id;
      // if (role === "Super Admin" || "Role" === "App Admin") {
      const shift = await Shift.deleteOne({ _id: req.params.id });
      return res.status(200).json({ message: "Succesfuly Deleted shift" });
      // }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to Deleted shift | server error" });
    }
  },
};
