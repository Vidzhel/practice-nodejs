const express = require("express");
const router = express.Router();
const dbConfig = require("../db/config");
const asyncHelper = require("./utils/helpers").asyncHelper;

const errors = require("./utils/errors");
const NotFound = errors.NotFound;

router.post(
    "/create",
    asyncHelper(async (req, res) => {
        const task = new dbConfig.Task({ description: req.body.description });
        await task.save();

        res.status(200);
        res.send();
    })
);

router.get(
    "/",
    asyncHelper(async (req, res) => {
        const tasks = await dbConfig.Task.find({});
        res.json(tasks);
    })
);

router.get(
    "/:id",
    asyncHelper(async (req, res) => {
        const task = await dbConfig.Task.findById(req.params.id);
        res.json(task);
    })
);

router.get(
    "/delete/:id",
    asyncHelper(async (req, res) => {
        const task = await dbConfig.Task.findById(req.params.id).exec();
        if (!task) {
            throw new NotFound("Task with the id wasn't found"); 
        }
        await task.delete();
        res.send();
    })
);

module.exports = router;
