const Employment = require("../employee/model");

module.exports = {
  getEmploymentOffday: async (req, res) => {
    try {
      const { id } = req.params;
      const employment = await Employment.findOne({ _id: id });
      //   const getOffdayEmployment = employment?.emp_attadance?.map(
      //     (day) => day.off_day === true
      //   );
      const schedule = employment?.emp_attadance;

      const offDays = Object.entries(schedule)
        .map(([day, { off_day }]) => ({ day, off_day }))
        .filter(({ off_day }) => off_day)
        .map(({ day }) => day[0].toUpperCase() + day.slice(1));
      console.log(offDays);
      return res.status(200).json(offDays);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to get employment shift" });
    }
  },
};
