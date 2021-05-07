const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        console.log("error email", value);
        throw new Error("Email is invalid");
      }
    },
    lowercase: true,
    unique: true,
    index: true,
  },
  name: { type: String, required: true, trim: true, minlength: 2 },
  age: {
    type: Number,
    validate: (value) => {
      if (value < 1) {
        console.log("error age", value);
        throw new Error("Age must be a positive value");
      }
    },
    default: 1,
  },
});

module.exports = UserSchema;
