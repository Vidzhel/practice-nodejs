const mongoose = require("mongoose");
const validator = require("validator");

module.exports = new mongoose.Schema({
	email: {
		type: String, required: true, trim: true, validate: (value) => {
			if (!validator.isEmail(value)) {
				throw new Error("Email is invalid");
			}
		}, lowercase: true, unique: true, index: true
	}, name: {type: String, required: true, trim: true}, age: {
		type: Number, validate: (value) => {
			if (value < 0) {
				throw new Error("Age must be a positive value");
			}
		}, default: 0
	}, password: {
		type: String, required: true, minlength: 7, trim: true, validate: (value) => {
			if (value.toLowerCase()
					 .includes("password")) {
				throw new Error("Password mustn't contain 'password' string");
			}
		}
	}
});
