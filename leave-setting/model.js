const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  leave_name: {
    type: String,
    required: true,
  },
  leave_type: {
    type: String,
    enum: ["Unpaid", "Paid"],
    default: "Unpdaid",
  },
  leave_status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("leave_setting", LeaveSchema);
