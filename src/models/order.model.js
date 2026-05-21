// // models/Order.js

import mongoose from "mongoose";

const { Schema } = mongoose;

/* =========================
   ORDER ITEM SUB-SCHEMA
========================= */

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

/* =========================
   SHIPPING ADDRESS SUB-SCHEMA
========================= */

const shippingAddressSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    street: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      default: "India",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* =========================
   ORDER SCHEMA
========================= */

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        "cod",
        "razorpay",
        "stripe",
      ],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INSTANCE METHODS
========================= */

// calculate total amount
orderSchema.methods.calculateTotal =
  function () {
    this.totalAmount = this.items.reduce(
      (total, item) => {
        return (
          total +
          item.price * item.quantity
        );
      },
      0
    );

    return this.totalAmount;
  };

// update order status
orderSchema.methods.updateOrderStatus =
  async function (status) {
    this.orderStatus = status;
    return await this.save();
  };

// update payment status
orderSchema.methods.updatePaymentStatus =
  async function (status) {
    this.paymentStatus = status;
    return await this.save();
  };

/* =========================
   STATIC METHODS
========================= */

// get orders by user
orderSchema.statics.getOrdersByUser =
  function (userId) {
    return this.find({ userId })
      .populate(
        "items.productId",
        "title images price"
      )
      .sort({ createdAt: -1 });
  };

// get all orders
orderSchema.statics.getAllOrders =
  function () {
    return this.find()
      .populate(
        "userId",
        "name email"
      )
      .sort({ createdAt: -1 });
  };

const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;

// import mongoose from "mongoose";

// const { Schema } = mongoose;

// /* =========================
//    ORDER ITEM SUB-SCHEMA
// ========================= */

// const orderItemSchema = new Schema(
//   {
//     productId: {
//       type: Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },

//     title: {
//       type: String,
//       required: true,
//     },

//     image: {
//       type: String,
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },
//   },
//   {
//     _id: false,
//   }
// );

// /* =========================
//    ORDER SCHEMA
// ========================= */

// const orderSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     items: [orderItemSchema],

//     shippingAddressId: {
//       type: Schema.Types.ObjectId,
//       ref: "Address",
//       required: true,
//     },

//     paymentId: {
//       type: Schema.Types.ObjectId,
//       ref: "Payment",
//     },

//     totalAmount: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     orderStatus: {
//       type: String,
//       enum: [
//         "pending",
//         "confirmed",
//         "processing",
//         "shipped",
//         "delivered",
//         "cancelled",
//       ],
//       default: "pending",
//     },

//     paymentStatus: {
//       type: String,
//       enum: [
//         "pending",
//         "paid",
//         "failed",
//         "refunded",
//       ],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// /* =========================
//    INSTANCE METHODS
// ========================= */

// // calculate total amount
// orderSchema.methods.calculateTotal = function () {
//   this.totalAmount = this.items.reduce(
//     (total, item) =>
//       total + item.price * item.quantity,
//     0
//   );

//   return this.totalAmount;
// };

// // update order status
// orderSchema.methods.updateOrderStatus = async function (status) {
//   this.orderStatus = status;
//   return await this.save();
// };

// // update payment status
// orderSchema.methods.updatePaymentStatus =
//   async function (status) {
//     this.paymentStatus = status;
//     return await this.save();
//   };

// /* =========================
//    STATIC METHODS
// ========================= */

// // get orders by user
// orderSchema.statics.getOrdersByUser = function (
//   userId
// ) {
//   return this.find({ userId })
//     .populate("items.productId")
//     .populate("shippingAddressId")
//     .sort({ createdAt: -1 });
// };

// // get all orders
// orderSchema.statics.getAllOrders = function () {
//   return this.find()
//     .populate("userId", "name email")
//     .populate("shippingAddressId")
//     .sort({ createdAt: -1 });
// };

// const Order = mongoose.model("Order", orderSchema);

// export default Order;