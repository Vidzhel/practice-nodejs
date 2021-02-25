const mongoose = require("mongoose");
const validator = require("validator");

module.exports = new mongoose.Schema({
	description: {
		type: String,
		required: true,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	}
});
