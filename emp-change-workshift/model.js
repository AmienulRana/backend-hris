const mongoose = require("mongoose");

const outsideSchema = mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employmeent",
    required: [true, "Please Select one employment"],
  },
  empchange_date_request: {
    type: String,
  },
  empchange_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shift",
    required: [true, "Please fill in the end outside date"],
  },
  empchange_replacement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employmeent",
    required: [true, "Please Select one employment to replacement"],
  },
  empchange_reason: {
    type: String,
    required: [true, "outside Reason required"],
  },
  empchange_fsuperior: {
    fsuperior_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
    status: {
      type: String,
      enum: ["Approved", "Rejected", "Not Approved", "Pending"],
      default: "Pending",
    },
    approved_by: {
      type: String,
    },
    approved_date: {
      type: String,
    },
    approved_hours: {
      type: String,
    },
  },
  empchange_ssuperior: {
    ssuperior_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
    status: {
      type: String,
      enum: ["Approved", "Rejected", "Not Approved", "Pending"],
      default: "Pending",
    },
    approved_by: {
      type: String,
    },
    approved_date: {
      type: String,
    },
    approved_hours: {
      type: String,
    },
  },
  empchange_hr: {
    status: {
      type: String,
      enum: ["Approved", "Rejected", "Pending"],
      default: "Pending",
    },
    approved_date: {
      type: String,
    },
    approved_hours: {
      type: String,
    },
  },
});

module.exports = mongoose.model("emp-change-shift", outsideSchema);
