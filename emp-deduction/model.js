const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AllowSchema = new Schema({
  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employmeent",
  },
  deduction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "allowdeduct",
  },
  deduction_selfpercent: {
    type: String,
  },
  deduction_status: {
    type: Boolean,
    default: false,
  },
  deduction_totalpercent: {
    type: Boolean,
    default: false,
  },
  deduction_companypercent: {
    type: String,
  },
});

module.exports = mongoose.model("emp_deduction", AllowSchema);
