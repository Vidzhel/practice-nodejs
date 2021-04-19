const mongoose = require("mongoose");
const userSchema = require("./schemas/user");
const taskSchema = require("./schemas/task");

module.exports.configureDb = async () => {
    let connection = null;

    try {
        connection = await mongoose.connect("mongodb://localhost/task_list", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to db");

        await configureSchemas(connection);
    } catch (e) {
        console.log(e);
    }

    module.exports.connection = connection;
    return connection;
};

const configureSchemas = async (connection) => {
    const userModel = connection.model("User", userSchema);
    await userModel.init();
    const taskModel = connection.model("Task", taskSchema);
    await taskModel.init();

    await createDefaultAdmin(userModel);

    module.exports.User = userModel;
    module.exports.Task = taskModel;
};

const createDefaultAdmin = async (userModel) => {
    const admin = await userModel.findOne({ isAdmin: true }).exec();

    if (!admin) {
        console.log("No admin found, creating default admin");
        const user = new userModel({
            email: "admin@mail.com",
            name: "admin",
            password: "admin12345",
            age: 20,
            isAdmin: true,
        });
        await user.save();
    }
};
