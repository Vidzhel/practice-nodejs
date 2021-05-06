const BaseError = require("./errors").BaseError;

module.exports.asyncExceptionsHandler = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};
