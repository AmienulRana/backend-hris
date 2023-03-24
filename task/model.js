const mongoose = require("mongoose");

const NotifSchema = mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  task_name: {
    type: String,
    required: true,
  },
  task_date_start: {
    type: String,
  },
  task_date_end: {
    type: String,
  },
  task_worker: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employmeent",
    },
  ],
  task_status: {
    type: String,
    enum: ["Passed", "Ongoing", "Not Started", "Stoped"],
  },
});

module.exports = mongoose.model("task", NotifSchema);
