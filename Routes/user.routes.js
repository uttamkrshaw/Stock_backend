const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../Model/user.model");

//  Add New User 

userRouter.post("/add", async (req, res) => {
  try {
    const new_user = new UserModel(req.body);
    await new_user.save();
    res.status(200).send({ msg: "New User Added" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});


module.exports = {
  userRouter,
};