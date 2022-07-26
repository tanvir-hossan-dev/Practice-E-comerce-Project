import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    numberofrating: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    catagroy: {
      type: String,
      required: true,
    },
    cupon: {
      type: String,
    },
    discount: {
      type: Number,
    },
    limit: {
      type: Number,
    },
    totalSale: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", ProductSchema);

export default Product;
