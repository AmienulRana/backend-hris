const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployementSchema = new Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  emp_profile: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  emp_firstname: {
    type: String,
  },
  emp_lastname: {
    type: String,
  },
  emp_fullname: {
    type: String,
  },
  emp_phone: {
    type: String,
  },
  emp_nikktp: {
    type: String,
  },
  emp_marital_status: {
    type: String,
  },
  emp_gender: {
    type: String,
    enum: ["Laki-Laki", "Perempuan"],
  },
  emp_birthday: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  emp_blood: {
    type: String,
  },
  password: {
    type: String,
  },
  emp_depid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departement",
  },
  emp_desid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
  },
  emp_fsuperior: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
  },
  emp_ssuperior: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
  },
  emp_tanggungan: {
    type: String,
  },
  emp_status: {
    type: String,
    enum: ["Permanent", "Probation", "Designation"],
  },
  emp_nik_karyawan: {
    type: String,
  },
  emp_location: {
    type: String,
  },
  emp_joining_data: {
    type: String,
  },
  role: {
    type: String,
    enum: ["App Admin", "Manager", "Employment"],
    default: "Employment",
  },
  emp_attadance: {
    senin: {
      shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shift",
        required: false,
        default: function () {
          if (this.shift === "") {
            return null;
          } else {
            return this.shift;
          }
        },
      },
      off_day: { type: Boolean },
    },
    selasa: {
      shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shift",
        required: false,
        default: function () {
          if (this.shift === "") {
            return null;
          } else {
            return this.shift;
          }
        },
      },
      off_day: { type: Boolean },
    },
    rabu: {
      shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shift",
        required: false,
        default: function () {
          if (this.shift === "") {
            return null;
          } else {
            return this.shift;
          }
        },
      },
      off_day: { type: Boolean },
    },
    kamis: {
      shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shift",
        required: false,
        default: function () {
          if (this.shift === "") {
            return null;
          } else {
            return this.shift;
          }
        },
      },
      off_day: { type: Boolean },
    },
    jumat: {
      shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shift",
        required: false,
        default: function () {
          if (this.shift === "") {
            return null;
          } else {
            return this.shift;
          }
        },
      },
      off_day: { type: Boolean },
    },
    sabtu: {
      shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shift",
        required: false,
        default: function () {
          if (this.shift === "") {
            return null;
          } else {
            return this.shift;
          }
        },
      },
      off_day: { type: Boolean },
    },
    minggu: {
      shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shift",
        required: false,
        default: function () {
          if (this.shift === "") {
            return null;
          } else {
            return this.shift;
          }
        },
      },
      off_day: { type: Boolean },
    },
  },
});

module.exports = mongoose.model("Employmeent", EmployementSchema);
