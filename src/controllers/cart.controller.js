// controllers/cart.controller.js

import Cart from "../models/cart.model.js"
import Product from "../models/product.model.js";


// helper — always returns populated cart
const getPopulatedCart = (userId) =>
  Cart.findOne({ userId }).populate(
    'items.productId',
    'title price images stock'
  )

/* =========================
   GET USER CART
========================= */
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId }).populate(
      'items.productId',
      'title price images stock'
    );

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/* =========================
   ADD TO CART
========================= */
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    await cart.addItem(
      productId,
      product.getFinalPrice(),
      quantity
    );

    const populatedCart = await getPopulatedCart(userId);

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/* =========================
   UPDATE CART ITEM
========================= */
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.updateItem(productId, quantity);

    const populatedCart = await getPopulatedCart(userId);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      data: populatedCart,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request",
    });
  }
};

/* =========================
   REMOVE CART ITEM
========================= */
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.removeItem(productId);

    const populatedCart = await getPopulatedCart(userId);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: populatedCart,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request",
    });
  }
};

/* =========================
   CLEAR CART
========================= */
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.clearCart();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};


export {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};
