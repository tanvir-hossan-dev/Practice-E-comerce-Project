import express from "express";
import { data } from "./data.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Alldiscount } from "./Alldiscount.js";
import seedRouter from "./Routes/seedRoutes.js";
import productsRouter from "./Routes/productsRouter.js";
import userRouter from "./Routes/userRouter.js";
import orderRouters from "./Routes/orderRouters.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mogodb connected");
  })
  .catch((error) => {});

app.use(cors());

app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLINT || "sd");
});

app.use("/api/seed/", seedRouter);
app.use("/products", productsRouter);
app.use("/api/users", userRouter);
app.use("/api/order", orderRouters);

app.get("/alldiscount", (req, res) => {
  res.send(Alldiscount);
});

app.get("/catagory/:cata", function (req, res) {
  let cataArr = [];
  data.find((item) => {
    if (item.catagroy == req.params.cata) {
      cataArr.push(item);
    }
  });
  res.send(cataArr);
});

app.get("/cartproduct/:id", function (req, res) {
  let product = data.find((item) => {
    if (item._id == req.params.id) {
      return item;
    }
  });
  res.send(product);
});
let port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Start 8000");
});
