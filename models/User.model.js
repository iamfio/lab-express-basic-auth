const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "username is required"],
      unique: true,
    },
    passwordHash: {
      type: String,
      trim: true,
      required: [true, "password is required"],
    },
  },
  { timestamps: true },
);

const User = model("User", userSchema);

module.exports = User;
