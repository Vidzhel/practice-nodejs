const express = require("express");
const router = express.Router();
const dbConfig = require("../db/config");
const asyncHelper = require("./utils/helpers").asyncHelper;

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

module.exports = router;
