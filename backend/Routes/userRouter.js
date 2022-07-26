import express from "express";
import User from "../Models/userModels.js";
import { genarateToken } from "../utils.js";
import bcrypt from "bcryptjs";

const userRouter = express.Router();

userRouter.post("/signin", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: genarateToken(user),
      });
    }
  }

  res.status(401).send({ msg: "Invalid email" });
});

userRouter.post("/signup", async (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });
  const user = await newUser.save();

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: genarateToken(user),
  });
});

export default userRouter;
