const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShiftSchema = new Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
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
  shift_desc: {
    type: String,
  },
  week_active: {
    type: String,
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
    default: true,
  },
  shift_type: {
    type: String,
  },
  schedule: {
    minggu_1: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_2: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_3: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_4: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_5: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_6: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_7: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_8: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_9: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_10: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_11: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_12: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_13: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_14: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_15: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_16: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_17: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_18: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_19: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_20: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_21: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_22: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_23: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_24: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_25: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_26: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_27: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_28: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_29: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_30: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_31: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_32: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_33: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_34: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_35: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_36: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_37: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_38: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_39: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_40: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_41: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_42: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_43: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_44: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_45: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_46: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_47: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_48: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_49: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_50: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_51: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_52: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
    minggu_53: {
      shift_clockin: { type: String },
      shift_clockout: { type: String },
      shift_break_duration: { type: Number },
    },
  },
});

module.exports = mongoose.model("shift", ShiftSchema);
