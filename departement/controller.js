const Departement = require("./model");

module.exports = {
  addNewDepartement: async (req, res) => {
    try {
      const { dep_name, dep_manager, dep_desc, dep_location, dep_created } =
        req.body;
      const { role } = req.admin;
      if (role === "Super Admin") {
        const newDepartement = new Departement({
          company_id: req.query.company,
          dep_name: dep_name,
          dep_manager: dep_manager,
          dep_desc: dep_desc,
          dep_status: "Active",
          dep_location: dep_location,
          dep_created: dep_created,
        });
        await newDepartement.save();
        res
          .status(200)
          .json({ message: "Successfully created a new Departement" });
      } else if (role === "App Admin") {
        const newDepartement = new Departement({
          company_id: req.admin.company_id,
          dep_name: dep_name,
          dep_manager: dep_manager,
          dep_desc: dep_desc,
          dep_status: "Active",
          dep_location: dep_location,
          dep_created: dep_created,
        });
        await newDepartement.save();
        res.json({ message: "Successfully created a new Departement" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Add new departement" });
    }
  },
  editDepartement: async (req, res) => {
    try {
      const { dep_name, dep_manager, dep_desc, dep_location, dep_workshift } =
        req.body;
      const { id } = req.params;
      const { role } = req?.admin;
      console.log(role);
      if (role === "Super Admin" || role === "App Admin") {
        const departement = await Departement.updateOne(
          { _id: id },
          {
            $set: {
              dep_name,
              dep_manager,
              dep_desc,
              dep_location,
              dep_workshift,
            },
          }
        );
        return res
          .status(200)
          .json({ message: "Successfully edited Departement" });
      } else {
        return res
          .status(422)
          .json({ message: "You can't change departments" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to edited departement" });
    }
  },
  getDepartement: async (req, res) => {
    try {
      const company_id = req?.admin?.company_id;
      if (req.admin.role === "Super Admin") {
        const company = req.query.company;
        const departemen = await Departement.find({
          company_id: company,
        }).populate({ path: "company_id", select: "company_name" });
        res.status(200).json(departemen);
      }
      if (company_id) {
        const departemen = await Departement.find({ company_id }).populate({
          path: "company_id",
          select: "company_name",
        });
        res.status(200).json(departemen);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Departement" });
    }
  },
  detailDepartement: async (req, res) => {
    try {
      const { id } = req?.params;
      const departemen = await Departement.findOne({
        _id: id,
      });
      res.status(200).json(departemen);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Departement" });
    }
  },
};
