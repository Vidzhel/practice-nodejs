const secret = require("../configs").secret;
const jwt = require("jsonwebtoken");
const dbConfigs = require("../db/config");
const util = require("util");
const verifyJwt = util.promisify(jwt.verify);

module.exports = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = await verifyJwt(token, secret, {});
        const user = await dbConfigs.User.findById(decoded.id);

        if (!user) {
            throw new Error("User doesn't exist");
        }
        if (!user.tokens.includes(token)) {
            throw new Error("Stale token");
        }

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        throw new Error("Token is invalid");
    }
};
