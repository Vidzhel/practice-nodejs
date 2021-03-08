const BaseError = require("./errors").BaseError;

module.exports.asyncHelper = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};
