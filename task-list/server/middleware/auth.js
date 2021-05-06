const secret = require("../configs").secret;
const jwt = require("jsonwebtoken");
const dbConfigs = require("../db/config");
const util = require("util");
const verifyJwt = util.promisify(jwt.verify);

module.exports = (adminOnly = false) => {
    return async (req, res, next) => {
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
            if (adminOnly && !user.isAdmin) {
                throw new Error("Admins only");
            }

            req.user = user;
            req.token = token;
            next();
        } catch (e) {
            throw new Error("Access forbidden: " + e.message);
        }
    };
};
