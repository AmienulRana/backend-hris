const Periodic = require("./model");

module.exports = {
  addNewPeriodic: async (req, res) => {
    try {
      const {
        periodic_years,
        periodic_month,
        periodic_start_date,
        periodic_end_date,
      } = req.body;
      const { role } = req.admin;
      const company_id =
        role === "Super Admin"
          ? req?.query?.company_id
          : req?.admin?.company_id;
      const periodic = new Periodic({
        company_id,
        periodic_end_date,
        periodic_month,
        periodic_start_date,
        periodic_years,
      });
      await periodic.save();
      return res.status(200).json({ message: "Successfuly add new Periodic" });
    } catch (error) {
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to added periodic | Server Error" });
    }
  },
  getPeriodic: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin"
          ? req?.query?.company_id
          : req?.admin?.company_id;
      if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
        const periodic = await Periodic.find({ company_id }).populate({
          path: "company_id",
          select: "company_name",
        });
        res.status(200).json(periodic);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to get periodic | Server Error" });
    }
  },
  editStatus: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
        const findPeriodic = await Periodic.findOne({ _id: id });
        const all_objs = await Periodic.updateMany(
          {},
          { $set: { periodic_status: false } }
        );
        const periodic = await Periodic.updateOne(
          { _id: id },
          {
            $set: {
              periodic_status: findPeriodic.status ? false : true,
            },
          }
        );
        if (periodic.modifiedCount > 0) {
          return res
            .status(200)
            .json({ message: "Successfuly edited status periodic" });
        } else {
          return res
            .status(200)
            .json({ message: "Failed to edited status periodic" });
        }
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to get periodic | Server Error" });
    }
  },
  getPeriodicActive: async (req, res) => {
    try {
      const { role } = req.admin;
      const company_id =
        role === "Super Admin"
          ? req?.query?.company_id
          : req?.admin?.company_id;
      if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
        const periodic = await Periodic.findOne({
          company_id,
          periodic_status: true,
        });
        console.log(periodic);
        res.status(200).json(periodic);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to get periodic | Server Error" });
    }
  },
};
