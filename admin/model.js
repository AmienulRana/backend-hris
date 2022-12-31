const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  email: {
    type: String,
    required: [true, "username can't be empty"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["App Admin", "Super Admin"],
  },
});

module.exports = mongoose.model("Admin", AdminSchema);
