const mongoose = require("mongoose");
const userSchema = require("./models/user");

module.exports.configureDb = async () => {
  let connection = null;

  try {
    connection = await mongoose.connect("mongodb://localhost/try_mocha", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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

  module.exports.User = userModel;
};
