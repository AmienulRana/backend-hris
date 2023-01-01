const Company = require("./model.js");
const bcrypt = require("bcrypt");
const generate_token = require("../utils/generateToken");

const validator = (value) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(value);
};

module.exports = {
  registerCompany: async (req, res) => {
    try {
      let { company_email, company_password, company_name } = req.body;
      const checkDuplicateEmail = await Company.findOne({ company_email });
      if (checkDuplicateEmail) {
        return res.status(422).json({ message: "Your email has been used" });
      }
      const checkDuplicateName = await Company.findOne({ company_name });
      if (checkDuplicateName) {
        return res
          .status(422)
          .json({ message: "Your company name has been created" });
      }
      if (validator(company_password)) {
        company_password = bcrypt.hashSync(company_password, 10);
        const company = new Company({
          company_email,
          company_password,
          company_name,
          role: "App Admin",
        });
        company
          .save()
          .then(() => {
            return res.status(200).json({
              message:
                "Registration is successful, Login to start your session",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({ message: "Registrasi failed" });
          });
      } else {
        return res.status(400).json({
          message:
            "Password must contain 1 lowercase letter [a-z], 1 uppercase letter [A-Z], 1 number [0-9]",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  loginCompany: async (req, res) => {
    try {
      const { email, password } = req.body;

      const company = await Company.findOne({ email });
      if (company) {
        const data = {
          company_id: company?._id,
          email: company?.email,
          role: company?.role,
        };
        const cek_password = bcrypt.compareSync(
          password,
          company.company_password
        );
        if (!cek_password)
          return res
            .status(401)
            .json({ message: "Your password or email maybe wrong" });

        const token = await generate_token(data);
        return res.status(200).json({
          message: "Authentication sukses",
          token,
        });
      }
      return error(res, 401, "Your password or email maybe wrong");
    } catch (error) {
      console.log(error);
    }
  },
  getAllCompany: async (req, res) => {
    try {
      const company = await Company.find().select("_id company_name");
      return res.status(200).json(company);
    } catch (error) {
      console.log(error);
    }
  },
};
