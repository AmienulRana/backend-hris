const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaveRequestSchema = new Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employmeent",
  },
  empleave_type_id: { type: String, required: true },
  empleave_leave_type: {
    type: String,
    required: true,
  },
  empleave_start_date: {
    type: String,
  },
  empleave_end_date: {
    type: String,
  },
  empleave_leave_duration: {
    type: String,
  },
  empleave_apply_date: {
    type: String,
  },
  empleave_reason: {
    type: String,
  },
  empleave_attachement: [
    {
      type: String,
    },
  ],
  empleave_status: {
    type: String,
    enum: ["Approved", "Pending", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("emp_leave", LeaveRequestSchema);
