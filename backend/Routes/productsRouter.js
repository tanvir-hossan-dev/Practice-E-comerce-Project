import express from "express";
import Product from "../Models/ProductModels.js";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  let products = await Product.find();
  res.send(products);
});

productsRouter.get("/:slug", async (req, res) => {
  let product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ msg: "product not found" });
  }
});

export default productsRouter;
