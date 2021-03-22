const express = require("express");
const router = express.Router();
const dbConfig = require("../db/config");
const asyncHelper = require("./utils/helpers").asyncHelper;
const authBarrier = require("../middleware/auth");

const errors = require("./utils/errors");
const WrongPasswordError = errors.WrongPasswordError;
const NotFound = errors.NotFound;

router.post(
    "/create",
    asyncHelper(async (req, res) => {
        const user = new dbConfig.User({
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            age: req.body.age,
        });
        await user.save();

        res.status(200);

        res.json({
            token: await user.generateToken(),
        });
    })
);

router.get(
    "/",
    asyncHelper(async (req, res) => {
        const users = await dbConfig.User.find({});
        res.json(users);
    })
);

router.post(
    "/update/:id",
    asyncHelper(async (req, res) => {
        const user = await dbConfig.User.findById(req.params.id);
        if (!user) {
            throw new NotFound("User with the id wasn't found");
        }

        ["name", "email", "age"].forEach((field) => {
            user[field] = req.body[field];
        });

        const newPassword = req.body.newPassword;
        if (newPassword) {
            if (await user.hasPassword(req.body.password)) {
                user.password = newPassword;
            } else {
                throw new WrongPasswordError();
            }
        }

        await user.save();

        res.json(user);
    })
);

router.post(
    "/auth",
    asyncHelper(async (req, res) => {
        try {
            const user = await dbConfig.User.findOneByCredentials(
                req.body.email,
                req.body.password
            );

            res.json({
                token: await user.generateToken(),
            });
        } catch (e) {
            res.status(400);
            throw e;
        }
    })
);

router.post(
    "/logout",
    asyncHelper(authBarrier),
    asyncHelper(async (req, res) => {
        req.user.tokens.remove(req.token);
        await req.user.save();
        res.send();
    })
);

router.get(
    "/me",
    asyncHelper(authBarrier),
    asyncHelper(async (req, res) => {
        return res.json(req.user);
    })
);

router.get(
    "/me/delete",
    asyncHelper(authBarrier),
    asyncHelper(async (req, res) => {
        await req.user.delete();
        res.send();
    })
);

router.get(
    "/:id",
    asyncHelper(async (req, res) => {
        const user = await dbConfig.User.findById(req.params.id);

        if (!user) {
            throw new NotFound("User with the id wasn't found");
        }

        res.json(user);
    })
);

module.exports = router;
