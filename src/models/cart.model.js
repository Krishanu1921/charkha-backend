// models/Cart.js

import mongoose from "mongoose";

const { Schema } = mongoose;

/* =========================
   CART ITEM SUB-SCHEMA
========================= */

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

/* =========================
   CART SCHEMA
========================= */

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],

    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INSTANCE METHODS
========================= */

// recalculate totals
cartSchema.methods.calculateTotals = function () {
  let totalPrice = 0;
  let totalItems = 0;

  this.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
    totalItems += item.quantity;
  });

  this.totalPrice = totalPrice;
  this.totalItems = totalItems;
};

// add item to cart
cartSchema.methods.addItem = async function (
  productId,
  price,
  quantity = 1
) {
  const existingItem = this.items.find(
    (item) =>
      item.productId.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      productId,
      price,
      quantity,
    });
  }

  this.calculateTotals();
  return await this.save();
};

// update quantity
cartSchema.methods.updateItem = async function (
  productId,
  quantity
) {
  const item = this.items.find(
    (item) =>
      item.productId.toString() === productId.toString()
  );

  if (!item) {
    throw new Error("Cart item not found");
  }

  item.quantity = quantity;

  this.calculateTotals();
  return await this.save();
};

// remove item
cartSchema.methods.removeItem = async function (
  productId
) {
  this.items = this.items.filter(
    (item) =>
      item.productId.toString() !== productId.toString()
  );

  this.calculateTotals();
  return await this.save();
};

// clear cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  this.totalPrice = 0;
  this.totalItems = 0;

  return await this.save();
};

/* =========================
   STATIC METHODS
========================= */

// get cart by user id
cartSchema.statics.getCartByUser = function (userId) {
  return this.findOne({ userId }).populate(
    "items.productId",
    "title price images stock"
  );
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;