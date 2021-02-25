const express = require('express');
const router = express.Router();
const dbConfig = require("../db/config");
const asyncHelper = require("./helpers").asyncHelper;

router.post("/create", asyncHelper (async(req, res) => {
  const user = new dbConfig.User({email: req.body.email, name: req.body.name, password: req.body.password, age: req.body.age});
  await user.save();
  res.send();
}));

router.get("/", asyncHelper(async (req, res) => {
  const users = await dbConfig.User.find({});
  res.json(users);
}));

router.get("/:id", asyncHelper(async (req, res) => {
  const user = await dbConfig.User.findById(req.params.id);
  res.json(user);
}));

module.exports = router;
