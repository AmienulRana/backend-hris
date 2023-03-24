const Task = require("./model");

module.exports = {
  addNewTask: async (req, res) => {
    try {
      const task = new Task(req.body);
      await task.save();
      return res.status(200).json({ message: "Berhasil Menambahkan Task" });
    } catch (error) {
      console.log(error);
    }
  },
};
