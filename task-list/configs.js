const process = require("process");

module.exports = {
    secret: process.env.NODE_ENV === "production" ? process.env.APP_TOKEN : "secret_key",
};
