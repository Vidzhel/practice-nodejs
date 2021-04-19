const express = require("express");
const router = express.Router();
const dbConfig = require("../db/config");
const asyncExceptionsHandler = require("./utils/helpers").asyncExceptionsHandler;
const authBarrier = require("../middleware/auth");

const errors = require("./utils/errors");
const WrongPasswordError = errors.WrongPasswordError;
const NotFound = errors.NotFound;

router.post(
    "/create",
    asyncExceptionsHandler(async (req, res) => {
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
    asyncExceptionsHandler(authBarrier(true)),
    asyncExceptionsHandler(async (req, res) => {
        const users = (await dbConfig.User.find({})).map((user) => user.toJson());
        res.json(users);
    })
);

router.post(
    "/me",
    asyncExceptionsHandler(authBarrier()),
    asyncExceptionsHandler(async (req, res) => {
        ["name", "email", "age"].forEach((field) => {
            req.user[field] = req.body[field];
        });

        const newPassword = req.body.newPassword;
        if (newPassword) {
            if (await req.user.hasPassword(req.body.password)) {
                req.user.password = newPassword;
            } else {
                throw new WrongPasswordError();
            }
        }

        await req.user.save();

        res.json(req.user.toJson());
    })
);

router.post(
    "/auth",
    asyncExceptionsHandler(async (req, res) => {
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
    asyncExceptionsHandler(authBarrier()),
    asyncExceptionsHandler(async (req, res) => {
        req.user.tokens.remove(req.token);
        await req.user.save();
        res.send();
    })
);

router.get(
    "/me",
    asyncExceptionsHandler(authBarrier()),
    asyncExceptionsHandler(async (req, res) => {
        return res.json(req.user.toJson());
    })
);

router.get(
    "/me/delete",
    asyncExceptionsHandler(authBarrier()),
    asyncExceptionsHandler(async (req, res) => {
        await req.user.delete();
        res.send();
    })
);

router.get(
    "/logout-all",
    asyncExceptionsHandler(authBarrier()),
    asyncExceptionsHandler(async (req, res) => {
        return await req.user.logoutAll();
    })
);

router.get(
    "/:id",
    asyncExceptionsHandler(async (req, res) => {
        const user = await dbConfig.User.findById(req.params.id);

        if (!user) {
            throw new NotFound("User with the id wasn't found");
        }

        res.json(user);
    })
);

module.exports = router;
