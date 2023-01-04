const Education = require("./model");

module.exports = {
  addNewEducation: async (req, res) => {
    try {
      const {
        empedu_type,
        empedu_institute,
        empedu_result,
        empedu_year,
        emp_id,
      } = req.body;
      const { role } = req.admin;
      if (role === "Super Admin" || role === "App Admin") {
        const newEducation = new Education({
          emp_id,
          empedu_type,
          empedu_result,
          empedu_year,
          empedu_institute,
        });
        await newEducation.save();
        return res
          .status(200)
          .json({ message: "Successfully created a Education" });
      } else {
        return res
          .status(422)
          .json({ message: "You can't add Education to this employment" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Add new Education" });
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
