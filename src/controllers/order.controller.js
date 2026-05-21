// controllers/order.controller.js

import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

/* =========================
   CREATE ORDER
========================= */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    // get user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // find selected address
    const selectedAddress = user.addresses.id(
      addressId
    );

    if (!selectedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // get user cart
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // validate stock
    for (const item of cart.items) {
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.productId.title} is out of stock`,
        });
      }
    }

    // prepare order items
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      title: item.productId.title,
      image:
        item.productId.images?.[0]?.url || "",
      price: item.price,
      quantity: item.quantity,
    }));

    // create order
    const order = await Order.create({
      userId,

      items: orderItems,

      shippingAddress: {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode:
          selectedAddress.postalCode,
        country: selectedAddress.country,
      },

      totalAmount: cart.totalPrice,
    });

    // reduce stock
    for (const item of cart.items) {
      item.productId.stock -= item.quantity;
      await item.productId.save();
    }

    // clear cart
    await cart.clearCart();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   GET MY ORDERS
========================= */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      userId,
    })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   GET ORDER BY ID
========================= */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("items.productId")
      .populate("userId", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // owner or admin only
    if (
      order.userId._id.toString() !==
        req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid order id",
    });
  }
};

/* =========================
   CANCEL ORDER
========================= */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate(
      "items.productId"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // only owner can cancel
    if (
      order.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // prevent cancelling delivered/cancelled
    if (
      order.orderStatus === "delivered" ||
      order.orderStatus === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order cannot be cancelled",
      });
    }

    // restore stock
    for (const item of order.items) {
      item.productId.stock += item.quantity;
      await item.productId.save();
    }

    order.orderStatus = "cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};

/* =========================
   ADMIN - GET ALL ORDERS
========================= */
export const getAllOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   ADMIN - UPDATE ORDER STATUS
========================= */
export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      !allowedStatuses.includes(orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
}

/* =========================
   ADMIN - DELETE ORDER
========================= */
export const deleteOrder = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const order =
      await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Order deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid order id",
    });
  }
};