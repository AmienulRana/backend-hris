const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShiftSchema = new Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  shift_name: {
    type: String,
    required: true,
  },
  shift_clockin: {
    type: String,
    required: true,
  },
  shift_clockout: {
    type: String,
    required: true,
  },
  shift_break_duration: {
    type: Number,
    required: true,
  },
  shift_late_tolarance: {
    type: Number,
    maxlength: 2,
  },
  shift_verylate_tolarance: {
    type: Number,
    maxlength: 2,
  },
  shift_status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("shift", ShiftSchema);
