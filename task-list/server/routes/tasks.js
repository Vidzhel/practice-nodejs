const express = require("express");
const router = express.Router();
const dbConfig = require("../db/config");
const asyncExceptionsHandler = require("./utils/helpers").asyncExceptionsHandler;
const authBarrier = require("../middleware/auth");

const errors = require("./utils/errors");
const NotFound = errors.NotFound;

router.post(
    "/create",
    // asyncExceptionsHandler(authBarrier()),
    asyncExceptionsHandler(async (req, res) => {
        const task = new dbConfig.Task({ description: req.body.description, owner: "60460a2b85712a45a02295f6" });
        await task.save();

        res.status(200);
        res.send(task);
    })
);

router.get(
    "/",
    // asyncExceptionsHandler(authBarrier()),
    asyncExceptionsHandler(async (req, res) => {
        let tasks;
        // if (req.user.isAdmin) {
        tasks = (await dbConfig.Task.find().populate("owner").exec()).map((task) => task.toJson());
        // } else {
        //     tasks = (
        //         await dbConfig.Task.find({ owner: req.user.id }).populate("owner").exec()
        //     ).map((task) => task.toJson());
        // }
        res.json(tasks);
    })
);

router.get(
    "/delete/:id",
    // asyncExceptionsHandler(authBarrier()),
    asyncExceptionsHandler(async (req, res) => {
        const task = await dbConfig.Task.findOne({ _id: req.params.id, owner: "60460a2b85712a45a02295f6"}).exec();
        if (!task) {
            throw new NotFound("Task with the id wasn't found");
        }
        await task.delete();
        res.send();
    })
);

router.post(
    "/update/:id",
    // asyncExceptionsHandler(authBarrier()),
    asyncExceptionsHandler(async (req, res) => {
        const task = await dbConfig.Task.findOne({ _id: req.params.id }).exec();

        // if (!req.user.isAdmin && req.user.id != task.owner) {
        //     throw new Error("Access forbidden");
        // }
        if (!task) {
            throw new NotFound("Task with the id wasn't found");
        }

        ["description", "completed"].forEach((field) => {
            task[field] = req.body[field];
        });

        await task.save();
        res.send(task.toJson());
    })
);

router.get(
    "/:id",
    asyncExceptionsHandler(authBarrier()),
    asyncExceptionsHandler(async (req, res) => {
        const task = await dbConfig.Task.findOne({ _id: req.params.id }).exec();

        if (!req.user.isAdmin && req.user.id != task.owner) {
            throw new Error("Access forbidden");
        }
        if (!task) {
            throw new NotFound("User's task with the id wasn't found");
        }

        res.json(task);
    })
);

module.exports = router;
