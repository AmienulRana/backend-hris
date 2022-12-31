const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartementSchema = new Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  des_name: {
    type: String,
    required: [true, "Departement name must be filled in"],
  },
  des_desc: {
    type: String,
  },
  des_employee_total: {
    type: Number,
  },
});

module.exports = mongoose.model("Designation", DepartementSchema);
