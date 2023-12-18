require("../src/db/mongoose");
const User = require("../src/models/user");

// User.findByIdAndUpdate("6553c95c256e433050c49dd6", { age: 35 })
//   .then((data) => {
//     console.log(data);
//     return User.countDocuments({ age: 34 });
//   })
//   .then((data1) => {
//     console.log(data1);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

/////////////////////////

const updateandcount = async (id, age) => {
  const data = await User.findByIdAndUpdate(id, { age });
  console.log(data);
  const data1 = await User.countDocuments({ age });
  return data1;
};

updateandcount("6553c32c42048630a02d57d7", 20)
  .then((data) => {
    console.log(data);
  })
  .catch((e) => {
    console.log(e);
  });
