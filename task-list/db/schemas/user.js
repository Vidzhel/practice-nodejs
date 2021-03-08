const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../../configs").secret;
const util = require("util");
const signJwt = util.promisify(jwt.sign);

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
        lowercase: true,
        unique: true,
        index: true,
    },
    name: { type: String, required: true, trim: true },
    age: {
        type: Number,
        validate: (value) => {
            if (value < 0) {
                throw new Error("Age must be a positive value");
            }
        },
        default: 0,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate: (value) => {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password mustn't contain 'password' string");
            }
        },
    },
    tokens: [String],
});

UserSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

UserSchema.methods.hasPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = async function () {
    const token = await signJwt(
        {
            id: this._id.toString(),
        },
        secret
        // TODO add expiry date
        // {
        //     expiresIn: "1d",
        // }
    );

    // TODO delete expired tokens
    this.tokens.push(token);
    await this.save();

    return token;
};

UserSchema.statics.findOneByCredentials = async function (email, password) {
    const user = await this.findOne({ email: email });

    if (!user) {
        throw new Error("Incorrect credentials");
    }

    if (!(await user.hasPassword(password))) {
        throw new Error("Incorrect credentials");
    }

    return user;
};

UserSchema.statics.getUserByToken = async function (token) {
    if (!token) {
        return null;
    }
};

module.exports = UserSchema;
