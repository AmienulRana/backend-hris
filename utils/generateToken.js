const jwt = require("jsonwebtoken");
const generate_token = (data) => {
  return jwt.sign({ ...data }, process.env.SECRET_KEY, { expiresIn: "1h" });
};
module.exports = generate_token;
