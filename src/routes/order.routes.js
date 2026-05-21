import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { cancelOrder, createOrder, deleteOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/order.controller.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const orderRouter = Router();

orderRouter.route('/create').post(verifyJWT, createOrder);
orderRouter.route('/my-orders').get(verifyJWT, getMyOrders);
orderRouter.route('/:id').get(verifyJWT, getOrderById);
orderRouter.route('/cancel/:id').patch(verifyJWT, cancelOrder);

orderRouter.route('/admin/all').get(verifyJWT, isAdmin, getAllOrders);
orderRouter.route('admin/status/:id').get(verifyJWT, isAdmin, updateOrderStatus);
orderRouter.route('/admin/delete/:id').delete(verifyJWT, isAdmin, deleteOrder);

export default orderRouter;
