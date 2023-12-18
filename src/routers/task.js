const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  //const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    // const task = await Task.find({ owner: req.user._id });
    // res.status(201).send(task);
    const match = {};
    const sort = {};
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.status(201).send(req.user.tasks);
  } catch (error) {
    res.status(400).send(error);
  }

  // Task.find({})
  //   .then((data) => {
  //     res.status(201).send(data);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return res.status(404).send();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["completed", "description"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send("Invalid operation");
  try {
    const data = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    //const data = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).send();

    updates.forEach((update) => (data[update] = req.body[update]));
    await data.save();

    res.status(201).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const data = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!data) return res.status(404).send();
    res.status(201).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
