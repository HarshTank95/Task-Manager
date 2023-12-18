const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = 3000;

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET request are disable");
//   } else {
//     next();
//   }
// });

// app.use((req, res, next) => {
//   res.status(503).send("Site is in maintainace please get back later");
// });

// const multer = require("multer");

// const upload = multer({
//   dest: "images",
// });

// app.post("/upload", upload.single("upload"), (req, res) => {
//   res.send();
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

const Task = require("./models/task");

const test = async () => {
  // const data = await Task.findById("655fb06541e9d726f4316db2");
  // await data.populate("owner").execPopulate();
  // console.log(data.owner);
  // const data = await User.findById("655faeefe00e170b741bbf11");
  // await data.populate("tasks").execPopulate();
  // console.log(data.tasks);
};

test();
