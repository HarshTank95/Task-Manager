require("../src/db/mongoose");
const Task = require("../src/models/task");

Task.findByIdAndRemove("6553c6d68298952a8009d94e")
  .then((data) => {
    console.log(data);
    return Task.countDocuments({ completed: true });
  })
  .then((data1) => {
    console.log(data1);
  })
  .catch((err) => {
    console.log(err);
  });
