const cron = require("node-cron");
const Employment = require("../employee/model");
const LeaveHol = require("../leave-holidays/model");
const moment = require("moment");
const Attedance = require("../attedance/model");
const { dateToday, getDayName } = require("../attedance/controller");
const LeaveRequest = require("../leave-request/model");
const Salary = require("../salary/model");
const LeaveSetting = require("../leave-setting/model");
const Workshift = require("../workshift/model");
const { weeknum, serialToday } = require("../workshift/controller");

async function checkLeaveHolEmployment() {
  const employment = await Employment.find();
  const getIdAndDepartmentId = employment.map((emp) => ({
    emp_id: emp?._id,
    emp_depid: emp?.emp_depid,
  }));
  const leaveHol = await LeaveHol.find();

  const now = moment();

  const activeLeavehol = leaveHol.filter((leavehol) => {
    const startDate = moment(leavehol.leavehol_startdate);
    const endDate = moment(leavehol.leavehol_enddate);
    return now.isBetween(startDate, endDate);
  });
  if (activeLeavehol.length > 0) {
    const matchingEmp = getIdAndDepartmentId.filter((emp) =>
      leaveHol.some((leavehol) =>
        leavehol.leavehol_depid.includes(emp.emp_depid)
      )
    );
    matchingEmp.map(async (employment) => {
      const chekcAttendanceToday = await Attedance.findOne({
        emp_id: employment?.emp_id,
        attendance_date: dateToday(),
      });
      const findEmployment = await Employment.findOne({
        _id: employment?.emp_id,
      }).populate({
        path: `emp_attadance.${[getDayName()]}.shift`,
      });
      if (chekcAttendanceToday) {
        if (!findEmployment?.emp_attadance[getDayName()]?.shift) {
          return;
        }
        const employmentShiftToday =
          findEmployment?.emp_attadance[getDayName()];
        const payload = {
          company_id: findEmployment?.company_id,
          emp_id: findEmployment?._id,
          insert_databy: "Has_Attendance",
          shift_id: employmentShiftToday?.shift?._id || "",
          workhours_in: employmentShiftToday?.shift?.shift_clockin || "",
          workhours_out: employmentShiftToday?.shift?.shift_clockout || "",
          clock_in: "-",
          clock_out: "-",
          break_in: "-",
          break_out: "-",
          attendance_date: dateToday(),
          workhours: "-",
          behavior_break: "-",
          count_lateduration: 0,
          attendance_status: `${leaveHol[0]?.leavehol_type}`,
          count_breakduration: 0,
          type: "Auto",
          behavior_at: "-",
          attendance_deduction: 0,
          break_deduction: 0,
        };
        const attendance = await Attedance.updateOne(
          { emp_id: findEmployment?._id, attendance_date: dateToday() },
          {
            $set: {
              ...payload,
            },
          }
        );
        if (attendance.updateCount > 0) {
          console.log("berhasil mengubah status menjadi cuti bersama");
        }
        console.log("leave hol check", attendance);
      } else {
        console.log("leaveHol -> employment belum absen");
      }
    });
  }
}

async function checkLeaveRequestEmployment() {
  const employment = await Employment.find();
  const leaveRequest = await LeaveRequest.find({
    empleave_status: "Approved",
    empleave_leave_type: { $in: ["Single Day", "Multi Day"] },
  });
  const activeLeaveRequest = leaveRequest.filter((req) => {
    if (req.empleave_end_date) {
      const startDate = moment(req?.empleave_start_date);
      if (req?.empleave_end_date) {
      }
      const endDate = moment(req?.empleave_end_date);
      return moment().isBetween(startDate, endDate);
    } else {
      return moment().isSame(req.empleave_start_date, "day");
    }
  });
  if (activeLeaveRequest.length > 0) {
    const resultLeaveEmp = activeLeaveRequest.filter((req) =>
      employment.some((emp) => emp._id.equals(req.emp_id))
    );
    resultLeaveEmp.map(async (employment) => {
      const chekcAttendanceToday = await Attedance.findOne({
        emp_id: employment?.emp_id,
        attendance_date: dateToday(),
      });
      const findEmployment = await Employment.findOne({
        _id: employment?.emp_id,
      }).populate({
        path: `emp_attadance.${[getDayName()]}.shift`,
      });
      if (chekcAttendanceToday) {
        if (!findEmployment?.emp_attadance[getDayName()]?.shift) {
          return;
        }
        const employmentShiftToday =
          findEmployment?.emp_attadance[getDayName()];
        const leaveType = await LeaveSetting.findOne({
          _id: employment?.empleave_type_id,
        });
        const payload = {
          company_id: findEmployment?.company_id,
          emp_id: findEmployment?._id,
          insert_databy: "Has_Attendance",
          shift_id: employmentShiftToday?.shift?._id || "",
          workhours_in: employmentShiftToday?.shift?.shift_clockin || "",
          workhours_out: employmentShiftToday?.shift?.shift_clockout || "",
          clock_in: "-",
          clock_out: "-",
          break_in: "-",
          break_out: "-",
          attendance_date: dateToday(),
          workhours: "-",
          behavior_break: "-",
          count_lateduration: 0,
          count_breakduration: 0,
          attendance_status: leaveType?.leave_desc,
          type: "Auto",
          behavior_at: "-",
          attendance_deduction: 0,
          break_deduction: 0,
        };
        const attendance = await Attedance.updateOne(
          { emp_id: findEmployment?._id, attendance_date: dateToday() },
          {
            $set: {
              ...payload,
            },
          }
        );
        if (attendance.updateCount > 0) {
          console.log("berhasil mengubah status menjadi leave request");
        }
      } else {
        console.log("leaveReq -> employment belum absen");
      }
    });
  }
}
async function calculateAttendanceAbsent(emp) {
  try {
    const salary = await Salary.findOne({ emp_id: emp?._id });
    if (salary) {
      return (
        salary?.emp_salary / salary?.emp_working_days +
        (0.5 * salary?.emp_salary) / salary?.emp_working_days
      );
    } else {
      return 1;
    }
  } catch (error) {
    console.log(error);
  }
}

async function addAbsentToAllEmployment() {
  try {
    const employment = await Employment.find();

    employment.map(async (employment) => {
      const chekcAttendanceToday = await Attedance.findOne({
        emp_id: employment?._id,
        attendance_date: dateToday(),
      });
      const findEmployment = await Employment.findOne({
        _id: employment?._id,
      }).populate({
        path: `emp_attadance.${[getDayName()]}.shift`,
      });
      if (!chekcAttendanceToday) {
        const employmentShiftToday =
          findEmployment?.emp_attadance[getDayName()];

        const payload = {
          company_id: findEmployment?.company_id,
          emp_id: findEmployment?._id,
          insert_databy: "Has_Attendance",
          shift_id: employmentShiftToday?.shift?._id || "",
          workhours_in: employmentShiftToday?.shift?.shift_clockin,
          workhours_out: employmentShiftToday?.shift?.shift_clockout,
          clock_in: "-",
          clock_out: "-",
          break_in: "-",
          break_out: "-",
          attendance_date: dateToday(),
          workhours: "-",
          behavior_break: "-",
          count_lateduration: 0,
          count_breakduration: 0,
          attendance_status: `Absent`,
          type: "Auto",
          behavior_at: "-",
          attendance_deduction: await calculateAttendanceAbsent(employment),
          break_deduction: 0,
        };
        const attendance = new Attedance(payload);
        await attendance
          .save()
          .then(() => console.log("berhasil menambahkan attedance karyawan"));
      } else {
      }
    });
  } catch (error) {
    console.log(error);
  }
}
async function checkStatusUndefinedAttendanceEmployment() {
  try {
    const employment = await Employment.find();

    employment.map(async (employment) => {
      const attendance = await Attedance.updateMany(
        { emp_id: employment?._id, attendance_deduction: 100000 },
        {
          $set: {
            attendance_deduction: await calculateAttendanceAbsent(employment),
          },
        }
      );
      // console.log(attendance);
      // const chekcAttendanceToday = await Attedance.deleteOne({
      //   emp_id: employment?._id,
      //   attendance_date: dateToday(),
      //   attendance_status: "undefined",
      // });

      // if (chekcAttendanceToday.deletedCount > 0) {
      //   console.log("Ada status yang undefined");
      //   addAbsentToAllEmployment();
      // }
    });
  } catch (error) {
    console.log(error);
  }
}
async function checkOffDayEmployment() {
  try {
    const employment = await Employment.find();

    employment.map(async (employment) => {
      const chekcAttendanceToday = await Attedance.findOne({
        emp_id: employment?._id,
        attendance_date: dateToday(),
      });
      const findEmployment = await Employment.findOne({
        _id: employment?._id,
      }).populate({
        path: `emp_attadance.${[getDayName()]}.shift`,
      });
      if (chekcAttendanceToday) {
        const employmentShiftToday =
          findEmployment?.emp_attadance[getDayName()];
        if (employmentShiftToday?.off_day) {
          const payload = {
            company_id: findEmployment?.company_id,
            emp_id: findEmployment?._id,
            insert_databy: "Has_Attendance",
            shift_id: employmentShiftToday?.shift?._id || "",
            workhours_in: employmentShiftToday?.shift?.shift_clockin,
            workhours_out: employmentShiftToday?.shift?.shift_clockout,
            clock_in: "-",
            clock_out: "-",
            break_in: "-",
            break_out: "-",
            attendance_date: dateToday(),
            workhours: "-",
            behavior_break: "-",
            count_lateduration: 0,
            count_breakduration: 0,
            attendance_status: `Off Day`,
            type: "Auto",
            behavior_at: "-",
            attendance_deduction: 0,
            break_deduction: 0,
          };
          const attendance = await Attedance.updateOne(
            { emp_id: findEmployment?._id, attendance_date: dateToday() },
            {
              $set: {
                ...payload,
              },
            }
          );
          // const attendance = await Attedance.findOne({
          //   emp_id: findEmployment?._id,
          //   attendance_date: dateToday(),
          // });
          console.log(attendance);
          console.log("ada yang libur coy");
          if (attendance.updateCount > 0) {
            console.log("berhasil mengubah status menjadi off day");
          }
        } else {
          console.log("tidak ada yang libur hari ini");
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function changeScheduleTime() {
  try {
    const week = weeknum(serialToday(), 2);
    const workshifts = await Workshift.find({ shift_type: "Schedule" });
    workshifts.map(async (workshift) => {
      const updateWorkshift = await Workshift.updateOne(
        { _id: workshift?._id },
        {
          $set: {
            shift_clockin: workshift?.schedule[`minggu_${week}`].shift_clockin,
            shift_clockout:
              workshift?.schedule[`minggu_${week}`]?.shift_clockout,
            shift_break_duration:
              workshift?.schedule[`minggu_${week}`]?.shift_break_duration,
            shift_desc: `${workshift?.shift_name} (${
              workshift?.schedule[`minggu_${weeknum(serialToday(), 2)}`]
                ?.shift_clockin
            }-${
              workshift?.schedule[`minggu_${weeknum(serialToday(), 2)}`]
                ?.shift_clockout
            }, ${
              workshift?.schedule[`minggu_${weeknum(serialToday(), 2)}`]
                ?.shift_break_duration < 10
                ? `0${
                    workshift?.schedule[`minggu_${weeknum(serialToday(), 2)}`]
                      ?.shift_break_duration
                  }:00 Hour`
                : `${
                    workshift?.schedule[`minggu_${weeknum(serialToday(), 2)}`]
                      ?.shift_break_duration
                  }:00 Hour`
            })`,
          },
        }
      );
      console.log(updateWorkshift);
    });
    // console.log(week);
  } catch (error) {
    console.log(error);
  }
}

cron.schedule("*/30 * * * *", async function () {
  try {
    // checkStatusUndefinedAttendanceEmployment();
    changeScheduleTime();
  } catch (error) {
    console.log(error);
  }
});

cron.schedule(
  "*/5 * * * *",
  async function () {
    try {
      addAbsentToAllEmployment();
    } catch (error) {
      console.log(error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Makassar", // set timezone to WITA
  }
);

cron.schedule(
  "2 0 * * *",
  async function () {
    try {
      checkOffDayEmployment();
    } catch (error) {
      console.log(error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Makassar", // set timezone to WITA
  }
);
cron.schedule(
  "3 0 * * *",
  async function () {
    try {
      checkLeaveHolEmployment();
    } catch (error) {
      console.log(error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Makassar", // set timezone to WITA
  }
);
cron.schedule(
  "4 0 * * *",
  async function () {
    try {
      checkLeaveRequestEmployment();
    } catch (error) {
      console.log(error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Makassar", // set timezone to WITA
  }
);

module.exports = {
  calculateAttendanceAbsent,
};
