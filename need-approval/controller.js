const Leave = require("../leave-request/model");
const Overtime = require("../overtime-request/model");
const Outside = require("../outside-request/model");
const Offday = require("../off-day/model");
const Workshift = require("../emp-change-workshift/model");

module.exports = {
  getNeedApproval: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin " || role === "Group Admin"
          ? req.query.company_id
          : req.admin.company_id;
      const leave = await Leave.find({ company_id }).populate({
        path: "emp_id",
        select: "emp_fullname _id email",
      });
      const overtime = await Overtime.find({ company_id })
        .populate({
          path: "emp_id",
          select: "emp_fullname _id email",
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
      const outside = await Outside.find({ company_id })
        .populate({
          path: "emp_id",
          select: "emp_fullname _id email",
        })
        .populate({
          path: "company_id",
          select: "company_name",
        })
        .populate({
          path: "outside_fsuperior.fsuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        })
        .populate({
          path: "outside_ssuperior.ssuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        });
      const offday = await Offday.find({ company_id })
        .populate({
          path: "emp_id",
          select: "emp_fullname _id email",
        })
        .populate({
          path: "emp_replacement",
          select: "emp_fullname _id",
        })
        .populate({
          path: "company_id",
          select: "company_name",
        })
        .populate({
          path: "offday_fsuperior.fsuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        })
        .populate({
          path: "offday_ssuperior.ssuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        });
      const workshift = await Workshift.find({ company_id })
        .populate({
          path: "emp_id",
          select: "emp_fullname _id email",
        })
        .populate({
          path: "empchange_replacement",
          select: "emp_fullname _id",
        })
        .populate({
          path: "empchange_shift_before",
          select: "shift_name _id shift_desc",
        })
        .populate({
          path: "empchange_to",
          select: "shift_name _id shift_desc",
        })
        .populate({
          path: "company_id",
          select: "company_name",
        })
        .populate({
          path: "empchange_fsuperior.fsuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        })
        .populate({
          path: "empchange_ssuperior.ssuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        });
      const payload = [
        { type: "Leave Request", data: leave },
        { type: "Overtime Request", data: overtime },
        { type: "Outside Assignment", data: outside },
        { type: "Change Offday", data: offday },
        { type: "Change Workshift", data: workshift },
      ];
      res.status(200).json(payload);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to get Need Approval" });
    }
  },
};
