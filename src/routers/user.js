const User = require("../models/user");
const auth = require("../middleware/auth");
const express = require("express");
const multer = require("multer");
//const sharp = require("sharp");
const router = new express.Router();

router.get("/test", (req, res) => {
  res.send("test");
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const data = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ data, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token != req.token);
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    res.status(201).send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "email", "password"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send("Invalid operation");
  try {
    // replace with findByIdAndUpdate just because to run User's pre function before update
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    //const data = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(201).send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    //const data = await User.findByIdAndDelete(req.user._id);
    await req.user.remove();
    res.status(201).send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    //const data = await User.findByIdAndDelete(req.user._id);
    req.user.avatars = undefined;
    await req.user.save();
    res.status(201).send(req.user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error("this file extension is not supported please upload jpg file"));
    }

    callback(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    // req.user.avatars = buffer;
    req.user.avatars = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatars) {
      throw new Error("no user found or no profile");
    }

    res.set("Content-Type", "image/jpg");
    res.send(user.avatars);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
