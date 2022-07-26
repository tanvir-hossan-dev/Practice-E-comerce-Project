import mongoose from "mongoose";

let orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        img: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      postCode: { type: String, required: true },
      city: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      upadate_time: String,
      email_address: String,
    },
    productPrice: { type: Number },
    shippingPrice: { type: Number },
    taxPrice: { type: Number },
    totalPrice: { type: Number },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isPaid: { type: Boolean, default: false },
    isDeliver: { type: Boolean, default: false },
    delivaredAt: { type: Date },
  },
  { timestamps: true }
);

const Orders = mongoose.model("orders", orderSchema);

export default Orders;
