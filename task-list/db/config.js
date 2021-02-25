const mongoose = require("mongoose");
const userSchema = require("./schemas/user");
const taskSchema = require("./schemas/task");

module.exports.configureDb = async () => {
	let connection = null;

	try {
		connection = await mongoose.connect(
			'mongodb://localhost/task_list',
			{useNewUrlParser: true, useUnifiedTopology: true}
		)
		console.log("Connected to db");

		await configureSchemas(connection);
	} catch(e) {
		console.log(e);
	}

	module.exports.connection = connection;
	return connection;
}

const configureSchemas = async (connection) => {
	const userModel = connection.model("User", userSchema);
	await userModel.init();
	const taskModel = connection.model("Task", taskSchema);
	await taskModel.init();

	module.exports.User = userModel;
	module.exports.Task = taskModel;
}

