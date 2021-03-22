const express = require("express");
const router = express.Router();
const dbConfig = require("../db/config");
const asyncExceptionsHandler = require("./utils/helpers").asyncExceptionsHandler;
const authBarrier = require("../middleware/auth");

const errors = require("./utils/errors");
const NotFound = errors.NotFound;

router.post(
    "/create",
    asyncExceptionsHandler(authBarrier),
    asyncExceptionsHandler(async (req, res) => {
        const task = new dbConfig.Task({ description: req.body.description, owner: req.user.id });
        await task.save();

        res.status(200);
        res.send();
    })
);

router.get(
    "/",
    asyncExceptionsHandler(authBarrier),
    asyncExceptionsHandler(async (req, res) => {
        const tasks = (await dbConfig.Task.find({owner: req.user.id}).populate("owner").exec()).map(task => task.toJson());
        res.json(tasks);
    })
);

router.get(
    "/delete/:id",
    asyncExceptionsHandler(authBarrier),
    asyncExceptionsHandler(async (req, res) => {
        const task = await dbConfig.Task.findOne({_id: req.params.id, owner: req.user.id}).exec();
        if (!task) {
            throw new NotFound("Task with the id wasn't found"); 
        }
        await task.delete();
        res.send();
    })
);

router.post(
    "/update/:id",
    asyncExceptionsHandler(authBarrier),
    asyncExceptionsHandler(async (req, res) => {
        const task = await dbConfig.Task.findOne({_id: req.params.id, owner: req.user.id}).exec();
        
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
    asyncExceptionsHandler(authBarrier),
    asyncExceptionsHandler(async (req, res) => {
        const task = await dbConfig.Task.findOne({_id: req.params.id, owner: req.user.id}).exec();

        if (!task) {
            throw new NotFound("User's task with the id wasn't found");
        }

        res.json(task);
    })
);

module.exports = router;
