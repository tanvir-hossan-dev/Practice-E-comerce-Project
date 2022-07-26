import express from "express";
import { data } from "../data.js";
import Product from "../Models/ProductModels.js";
import User from "../Models/userModels.js";
import userData from "../userData.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Product.remove({});
  const product = await Product.insertMany(data);
  await User.remove({});
  const user = await User.insertMany(userData);
  res.send(user);
});

export default seedRouter;
