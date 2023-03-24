const Payrun = require("./model");
const Employment = require("../employee/model");
const Payrol = require("../salary/model");
const Allowance = require("../emp-allowance/model");
const Deduction = require("../emp-deduction/model");
const Periodic = require("../periodic/model");
const Attendance = require("../attedance/model");
const moment = require("moment");
const Overtime = require("../overtime-request/model");
const fs = require("fs");

function handleCalender(periodic_start_date, periodic_end_date, formatDate) {
  let currentDate = moment(periodic_start_date);
  const end = moment(periodic_end_date);
  const dates = [];

  if (formatDate === "MM/DD/YYYY") {
    while (currentDate <= end) {
      dates.push({
        show_date: currentDate.format("DD MMM"),
        date: currentDate.format("MM/DD/YYYY"),
      });
      currentDate = currentDate.add(1, "days");
    }
  } else {
    while (currentDate <= end) {
      dates.push({
        show_date: currentDate.format("DD MMM"),
        date: currentDate.format("YYYY-MM-DD"),
      });
      currentDate = currentDate.add(1, "days");
    }
  }
  return dates;
}

module.exports = {
  generatePayrun: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin " || role === "Group Admin"
          ? req.query.company_id
          : req.admin.company_id;
      const employments = await Employment.find({ company_id })
        .select("_id emp_fullname emp_depid")
        .populate({
          path: "emp_depid",
          select: "dep_name",
        });
      const periodic_active = await Periodic.findOne({
        company_id,
        _id: req.query.periodic_id,
      });
      if (!periodic_active) {
        return res.status(422).json({
          message: `Failed generated payrun | You dont't have periodic`,
        });
      }
      const getDatePeriodicAttendance = handleCalender(
        periodic_active?.periodic_start_date,
        periodic_active?.periodic_end_date,
        "MM/DD/YYYY"
      );
      const promises = employments.map(async (employment) => {
        const salary = await Payrol.findOne({ emp_id: employment?._id });
        const allowance = await Allowance.find({
          emp_id: employment?._id,
        }).populate("empallow_allowance_id");

        const attendances = await Attendance.find({
          emp_id: employment?._id,
        });

        const filteredAttendances = attendances.filter((attendance) => {
          return getDatePeriodicAttendance.some(
            (period) => period.date === attendance.attendance_date
          );
        });
        const AttendanceStatus = filteredAttendances.filter(
          (attendance) => attendance?.attendance_status === "Attendance"
        );

        const emp_allowance = allowance.map((allow) => {
          if (allow?.empallow_allowance_type === "Proposional") {
            return {
              total:
                (+allow?.empallow_allowance_amount / salary?.emp_working_days) *
                AttendanceStatus?.length,
              name: allow?.empallow_allowance_id?.ad_name,
              percent: false,
              allow_id: allow?._id,
              edit: false,
            };
          } else {
            return {
              total: +allow?.empallow_allowance_amount || 0,
              name: allow?.empallow_allowance_id?.ad_name,
              percent: false,
              allow_id: allow?._id,
              edit: false,
            };
          }
        });
        const total_emp_allowance = emp_allowance.reduce(
          (total, allow) => total + allow?.total,
          0
        );

        const deduction = await Deduction.find({
          emp_id: employment?._id,
        }).populate("deduction_id");

        const filterDeductionEmployment = deduction.map((deduction) => ({
          total: Number(deduction?.deduction_totalpercent || 0),
          name: deduction?.deduction_id?.ad_name,
          percent: true,
          deduct_id: deduction?._id,
          edit: false,
        }));
        const totalPercentDeduction = filterDeductionEmployment.reduce(
          (total, value) => total + value?.total,
          0
        );
        const AllowanceCompanyFromDeduc = deduction
          .filter((deduc) => +deduc?.deduction_companypercent > 0)
          .map((deduction) => ({
            total: Number(deduction?.deduction_companypercent || 0),
            name: deduction?.deduction_id?.ad_name,
            percent: true,
            deduction_id: deduction?._id,
          }));
        const totalPercentCompanyAllow = AllowanceCompanyFromDeduc.reduce(
          (total, value) => total + value?.total,
          0
        );
        const total_allowance_company =
          (totalPercentCompanyAllow / 100) * salary?.emp_salary;

        const totalDeductionAbsent = filteredAttendances.reduce(
          (total, attendance) =>
            total + Number(attendance?.attendance_deduction),
          0
        );

        const getDatePeriodicOvertime = handleCalender(
          periodic_active?.periodic_start_date,
          periodic_active?.periodic_end_date,
          "YYYY-MM-DD"
        );

        const overtime = await Overtime.find({
          emp_id: employment?._id,
          "overtime_hr.status": "Approved",
        });
        const total_amount_overtime = overtime
          .filter((over) => {
            return getDatePeriodicOvertime.some(
              (period) => period.date === over?.overtime_created
            );
          })
          .reduce((total, overtime) => total + +overtime?.overtime_amount, 0);

        const payrun_net_salary =
          (salary?.emp_salary || 0) +
          total_emp_allowance -
          totalDeductionAbsent +
          total_amount_overtime +
          Math.round(total_allowance_company);
        const total_deduction =
          (totalPercentDeduction / 100) * salary?.emp_salary;

        const payrun_total_allowance =
          total_emp_allowance +
          total_amount_overtime +
          Math.round(total_allowance_company);
        const payload = {
          company_id: company_id,
          emp_id: employment?._id,
          payrun_type_period: salary?.emp_periode || "Bulan",
          payrun_salary: salary?.emp_salary || 0,
          payrun_allowance: [...emp_allowance, ...AllowanceCompanyFromDeduc],
          payrun_deduction: filterDeductionEmployment,
          payrun_total_allowance,
          payrun_total_deduction: Math.round(total_deduction) || 0,
          payrun_net_salary,
          payrun_period: periodic_active?._id,
          payrun_total_deduct_attendance: totalDeductionAbsent,
          payrun_total_overtime: total_amount_overtime,
        };
        const checkEmploymentPayrun = await Payrun.findOne({
          emp_id: employment?._id,
          payrun_period: periodic_active?._id,
        });
        if (!checkEmploymentPayrun) {
          const payrun = new Payrun(payload);
          await payrun.save();
        } else if (checkEmploymentPayrun) {
          // console.log("ada");
          const updatePayrun = await Payrun.updateOne(
            { emp_id: employment?._id, payrun_periodic: periodic_active?._id },
            {
              $set: {
                ...payload,
              },
            }
          );
        }
      });

      Promise.all(promises).then(async () => {
        const payruns = await Payrun.find({ company_id });
        return res.status(200).json({
          message: `Succesfully generated payrun for periodic ${periodic_active?.periodic_month} ${periodic_active?.periodic_years}`,
        });
      });
      //   console.log(employments);/
    } catch (error) {
      console.log(error);
      return res
        .status(422)
        .json({ message: `Failed generated payrun | Internal server error ` });
    }
  },
  getPayrun: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin " || role === "Group Admin"
          ? req.query.company_id
          : req.admin.company_id;
      const payrun = await Payrun.find({
        company_id,
        payrun_period: req.query.periodic_id,
      })
        .populate({
          path: "emp_id",
          select: "emp_fullname _id emp_depid emp_desid email",
          populate: [
            {
              path: "emp_depid",
              select: "dep_name",
            },
            {
              path: "emp_desid",
              select: "des_name",
            },
          ],
        })
        .populate({
          path: "payrun_period",
        });
      return res.status(200).json(payrun);
    } catch (error) {
      console.log(error);
    }
  },
  editStatusPayrun: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;
      let payrunStatus;
      if (status === "Approve Finance") {
        payrunStatus = "Approve";
      } else if (status === "Pending") {
        payrunStatus = "Pending";
      } else if (status === "Cancel Payrun") {
        payrunStatus = "Cancel";
      }
      const updateStatusPayrun = await Payrun.updateOne(
        {
          _id: id,
        },
        { $set: { payrun_status: payrunStatus } }
      );
      if (updateStatusPayrun.modifiedCount > 0) {
        return res.status(200).json({
          message: `Succesfully updated payrun status`,
        });
      } else {
        return res.status(422).json({
          message: `Failed updated payrun status`,
        });
      }
    } catch (error) {
      return res.status(422).json({
        message: `Failed edit status payrun | Internal server error `,
      });
    }
  },
  recalculatePayrun: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin " || role === "Group Admin"
          ? req.query.company_id
          : req.admin.company_id;
      const { id } = req.params;
      const periodic_active = await Periodic.findOne({
        company_id,
        _id: req.query.periodic_id,
      });
      if (!periodic_active) {
        return res.status(422).json({
          message: `Failed generated payrun | You dont't have periodic`,
        });
      }
      const getDatePeriodicAttendance = handleCalender(
        periodic_active?.periodic_start_date,
        periodic_active?.periodic_end_date,
        "MM/DD/YYYY"
      );
      const payrun = await Payrun.findOne({ _id: id });
      const employment = await Employment.findOne({ _id: payrun?.emp_id });
      const salary = await Payrol.findOne({ emp_id: employment?._id });
      const allowance = await Allowance.find({
        emp_id: employment?._id,
      }).populate("empallow_allowance_id");

      const attendances = await Attendance.find({
        emp_id: employment?._id,
      });

      const filteredAttendances = attendances.filter((attendance) => {
        return getDatePeriodicAttendance.some(
          (period) => period.date === attendance.attendance_date
        );
      });
      const AttendanceStatus = filteredAttendances.filter(
        (attendance) => attendance?.attendance_status === "Attendance"
      );

      const emp_allowance = allowance.map((allow) => {
        if (allow?.empallow_allowance_type === "Proposional") {
          return {
            total:
              (+allow?.empallow_allowance_amount / salary?.emp_working_days) *
              AttendanceStatus?.length,
            name: allow?.empallow_allowance_id?.ad_name,
            percent: false,
            allow_id: allow?._id,
            edit: false,
          };
        } else {
          return {
            total: +allow?.empallow_allowance_amount || 0,
            name: allow?.empallow_allowance_id?.ad_name,
            percent: false,
            allow_id: allow?._id,
            edit: false,
          };
        }
      });
      const total_emp_allowance = emp_allowance.reduce(
        (total, allow) => total + allow?.total,
        0
      );

      const deduction = await Deduction.find({
        emp_id: employment?._id,
      }).populate("deduction_id");

      const filterDeductionEmployment = deduction.map((deduction) => ({
        total: Number(deduction?.deduction_totalpercent || 0),
        name: deduction?.deduction_id?.ad_name,
        percent: true,
        deduct_id: deduction?._id,
        edit: false,
      }));
      const totalPercentDeduction = filterDeductionEmployment.reduce(
        (total, value) => total + value?.total,
        0
      );
      const AllowanceCompanyFromDeduc = deduction
        .filter((deduc) => +deduc?.deduction_companypercent > 0)
        .map((deduction) => ({
          total: Number(deduction?.deduction_companypercent || 0),
          name: deduction?.deduction_id?.ad_name,
          percent: true,
          deduction_id: deduction?._id,
        }));
      const totalPercentCompanyAllow = AllowanceCompanyFromDeduc.reduce(
        (total, value) => total + value?.total,
        0
      );
      const total_allowance_company =
        (totalPercentCompanyAllow / 100) * salary?.emp_salary;

      const totalDeductionAbsent = filteredAttendances.reduce(
        (total, attendance) => total + Number(attendance?.attendance_deduction),
        0
      );

      const getDatePeriodicOvertime = handleCalender(
        periodic_active?.periodic_start_date,
        periodic_active?.periodic_end_date,
        "YYYY-MM-DD"
      );

      const overtime = await Overtime.find({
        emp_id: employment?._id,
        "overtime_hr.status": "Approved",
      });
      const total_amount_overtime = overtime
        .filter((over) => {
          return getDatePeriodicOvertime.some(
            (period) => period.date === over?.overtime_created
          );
        })
        .reduce((total, overtime) => total + +overtime?.overtime_amount, 0);

      const payrun_net_salary =
        (salary?.emp_salary || 0) +
        total_emp_allowance -
        totalDeductionAbsent +
        total_amount_overtime +
        Math.round(total_allowance_company);
      const total_deduction =
        (totalPercentDeduction / 100) * salary?.emp_salary;

      const payrun_total_allowance =
        total_emp_allowance +
        total_amount_overtime +
        Math.round(total_allowance_company);
      const payload = {
        company_id: company_id,
        emp_id: employment?._id,
        payrun_type_period: salary?.emp_periode || "Bulan",
        payrun_salary: salary?.emp_salary || 0,
        payrun_allowance: [...emp_allowance, ...AllowanceCompanyFromDeduc],
        payrun_deduction: filterDeductionEmployment,
        payrun_total_allowance,
        payrun_total_deduction: Math.round(total_deduction) || 0,
        payrun_net_salary,
        payrun_period: periodic_active?._id,
        payrun_total_deduct_attendance: totalDeductionAbsent,
        payrun_total_overtime: total_amount_overtime,
      };
      const updatePayrun = await Payrun.updateOne(
        { _id: id },
        {
          $set: {
            ...payload,
          },
        }
      );
      if (updatePayrun.modifiedCount > 0) {
        return res.status(200).json({
          message: "Succesfully Recalculate Payrun",
        });
      } else {
        return res.status(422).json({
          message: "This Payrun Already up to date",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(422).json({
        message: `Failed Recalculate payrun | Internal server error `,
      });
    }
  },
  editDataPayslip: async (req, res) => {
    try {
      const {
        payrun_net_salary,
        payrun_total_allowance,
        payrun_total_deduction,
        payrun_allowance,
        payrun_deduction,
        payrun_total_deduct_attendance,
      } = req.body;
      const payrun = await Payrun.updateOne(
        { _id: req.params.id },
        {
          $set: {
            payrun_net_salary,
            payrun_allowance,
            payrun_deduction,
            payrun_total_allowance,
            payrun_total_deduction,
            payrun_total_deduct_attendance,
          },
        }
      );
      if (payrun.modifiedCount > 0) {
        return res.status(200).json({
          message: "Succesfully Edited Payrun",
        });
      } else {
        return res.status(422).json({
          message: "This Payrun Already up to date",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(422).json({
        message: `Failed Edit Payslip | Internal server error `,
      });
    }
  },
  handleUploadFile: async (req, res) => {
    try {
      const payrun = await Payrun.findOne({ _id: req.params.id }).populate(
        "emp_id"
      );
      if (payrun.payrun_file && req.file?.filename) {
        fs.unlinkSync(`public/files/${payrun.payrun_file}`);
      }
      const updateFilePdf = await Payrun.updateOne(
        { _id: req.params.id },
        {
          $set: {
            payrun_file: req.file.filename,
          },
        }
      );
      if (updateFilePdf.modifiedCount > 0 && payrun?.payrun_file) {
        return res.status(200).json({
          message: `Succesfully Resend Payslip to ${payrun.emp_id?.emp_fullname}`,
        });
      } else if (updateFilePdf.modifiedCount > 0) {
        return res.status(200).json({
          message: `Succesfully Send Payslip to ${payrun.emp_id?.emp_fullname}`,
        });
      } else {
        return res.status(422).json({
          message: `Failed Send Payslip to ${payrun.emp_id?.emp_fullname}`,
        });
      }
      // return res.status(200).json({ message: "tes" });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(`public/files/${req.file.filename}`);
      }
      return res.status(422).json({
        message: `Failed Send Payslip to employment`,
      });
    }
  },
};
