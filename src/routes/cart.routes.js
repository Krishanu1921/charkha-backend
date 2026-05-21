import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.route("/").get(verifyJWT, getCart);
cartRouter.route("/add").post(verifyJWT, addToCart);
cartRouter.route("/update").put(verifyJWT, updateCartItem);
cartRouter.route("/items/:productId").delete(verifyJWT, removeCartItem);
cartRouter.route("/clear").delete(verifyJWT, clearCart);

export default cartRouter;