const OvertimeRequest = require("./model");
const Employment = require("../employee/model");
const { populate } = require("./model");

function formatHours(jam, menit) {
  return `${jam < 10 ? "0" + jam.toString() : jam.toString()}:${
    menit < 10 ? "0" + menit.toString() : menit.toString()
  } Hours`;
}

function getDurationOvertime(start_hours, end_hours) {
  const start_time = new Date(`1970-01-01T${start_hours}:00`);
  const end_time = new Date(`1970-01-01T${end_hours}:00`);
  const diffrent = end_time - start_time;

  const hour = Math.floor(diffrent / (1000 * 60 * 60));
  const minute = Math.floor((diffrent % (1000 * 60 * 60)) / (1000 * 60));

  return formatHours(hour, minute);
}
module.exports = {
  addOvertimeRequest: async (req, res) => {
    try {
      const {
        emp_id,
        overtime_reason,
        overtime_date,
        overtime_start_hours,
        overtime_end_hours,
      } = req.body;
      const employement = await Employment.findOne({ _id: emp_id });
      const payload = {
        company_id: employement?.company_id,
        emp_id,
        overtime_date,
        overtime_end_hours,
        overtime_start_hours,
        overtime_reason,
        overtime_duration: getDurationOvertime(
          overtime_start_hours,
          overtime_end_hours
        ),
        overtime_fsuperior: { fsuperior_id: employement?.emp_fsuperior },
        overtime_ssuperior: {
          ssuperior_id: employement.emp_ssuperior
            ? employement.emp_ssuperior
            : employement?.emp_fsuperior,
        },
      };
      const overtimeRequest = new OvertimeRequest({
        ...payload,
      });
      await overtimeRequest.save();
      return res
        .status(200)
        .json({ message: "Successfully added Request Leave" });
    } catch (error) {
      console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to added Request Leave | Server Error" });
    }
  },
  getOvertimeRequest: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin"
          ? req?.query?.company_id
          : req?.admin?.company_id;
      if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
        const overtimeRequest = await OvertimeRequest.find({
          company_id,
        })
          .populate({
            path: "emp_id",
            select: "emp_fullname _id emp_depid",
            populate: {
              path: "emp_depid",
              select: "dep_name",
            },
          })
          .populate({
            path: "company_id",
            select: "company_name",
          })
          .populate({
            path: "overtime_fsuperior.fsuperior_id",
            select: "des_name emp_id",
            populate: {
              path: "emp_id",
              select: "emp_fullname",
            },
          })
          .populate({
            path: "overtime_ssuperior.ssuperior_id",
            select: "des_name emp_id",
            populate: {
              path: "emp_id",
              select: "emp_fullname",
            },
          });

        res.status(200).json(overtimeRequest);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Departement" });
    }
  },
  editOvertimeRequest: async (req, res) => {
    try {
      console.log(req.body);
      const overtimeRequest = await OvertimeRequest.updateOne(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
          },
        }
      );
      if (overtimeRequest.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully edit status Request Leave" });
      }
    } catch (error) {
      console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to added Request Leave | Server Error" });
    }
  },
};
