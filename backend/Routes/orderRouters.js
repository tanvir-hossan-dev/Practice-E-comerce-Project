import express from "express";
import Orders from "../Models/OrderModels.js";
import { isAuth } from "../utils.js";

const orderRouters = express.Router();
orderRouters.post("/", isAuth, async (req, res) => {
  const neworder = new Orders({
    orderItems: req.body.orderItems.map((p) => ({ ...p, product: p._id })),
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    productPrice: req.body.productPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });

  const order = await neworder.save();
  res.status(201).send({ msg: "New order created", order });
});

orderRouters.get("/:id", async (req, res) => {
  const order = await Orders.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ Msg: "Order not found" });
  }
});

orderRouters.put("/:id/pay", isAuth, async (req, res) => {
  const order = await Orders.findById(req.params.id);
  if (order) {
    (order.isPaid = true),
      (order.paidAt = Date.now()),
      (order.paymentResult = {
        id: req.body.id,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      });
    const updateOrder = await order.save();
    res.send({ Msg: "Order is paid", updateOrder });
  } else {
    res.status(404).send({ Msg: "Order not found" });
  }
});

orderRouters.post("/:id/payment_stripe", async (req, res) => {
  const { token = {}, amount = 0 } = req.body;

  if (!Object.keys(token).length || !amount) {
    res.status(400).send({ msg: "Order not found" });
  }

  const { id: customerId } = await Stripe.customer
    .create({
      email: token.email,
      source: token.id,
    })
    .catch((e) => {
      return null;
    });

  const invoiceId = `${token.email}${Math.random().toString()}${Date.now().toString()}`;

  const charge = await Stripe.ChargeResource.create(
    {
      amount: amount,
      currency: "USD",
      receipt_email: token.email,
      description: "E-valy Payment ",
    },
    { idempotencyKey: invoiceId }
  ).catch((e) => {
    return null;
  });

  if (!charge) {
    res.status(500).send({ msg: "Order not found" });
  }

  res.status(201).send({ msg: "Order is Paid" });
});

export default orderRouters;
