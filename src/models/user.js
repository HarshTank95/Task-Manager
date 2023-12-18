const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("it is not email");
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) throw new Error("password should not be there in the password");
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0 || value > 99) throw Error("Age must be between 0 and 99!");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          require: true,
        },
      },
    ],
    avatars: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "harshtank");

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.tokens;
  delete userObject.password;
  delete userObject.avatars;
  return userObject;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    console.log("inside");
    user.password = await bcrypt.hash(user.password, 8);
  }

  //console.log(user);
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
