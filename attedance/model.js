const mongoose = require("mongoose");

const AttedanceSchema = mongoose.Schema({
  insert_databy: {
    type: String,
    enum: ["Auto_Schedule", "Has_Attendance"],
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employmeent",
  },
  attendance_date: {
    type: String,
    required: true,
  },
  shift_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shift",
  },
  workhours: {
    type: String,
  },
  break_duration: {
    type: String,
  },
  workhours_in: {
    type: String,
  },
  workhours_out: {
    type: String,
  },
  clock_in: {
    type: String,
    required: true,
  },
  clock_out: {
    type: String,
    required: true,
  },
  behavior_at: {
    type: String,
    emun: ["Regular", "Late", "Early"],
  },
  count_lateduration: {
    type: String,
  },
  type: {
    type: String,
  },
  break_in: {
    type: String,
  },
  break_out: {
    type: String,
  },
  behavior_break: {
    type: String,
    emun: ["Regular", "Late", "Early"],
  },
  count_breakduration: {
    type: String,
  },
  attendance_status: {
    type: String,
  },
  attendance_deduction: {
    type: Number,
  },
  orther_break_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orther_break",
    required: false,
  },
});

module.exports = mongoose.model("emp_attendance", AttedanceSchema);
