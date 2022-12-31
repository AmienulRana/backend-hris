const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  company_name: {
    type: String,
    required: [true, "Company name must be filled in"],
  },
  company_desc: {
    type: String,
  },
  company_copyright: {
    type: String,
  },
  company_contact: {
    type: String,
  },
  company_currency: {
    type: String,
  },
  company_cursymbol: {
    type: String,
  },
  company_email: {
    type: String,
    required: [true, "Company email must be filled in"],
  },
  company_password: {
    type: String,
    required: true,
  },
  company_address: {
    type: String,
  },
  company_image: {
    type: String,
  },
  role: {
    type: String,
  },
});

module.exports = mongoose.model("Company", CompanySchema);
