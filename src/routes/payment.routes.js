import express from "express";

import {
    createPaymentOrder,
    savePayment
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createPaymentOrder);

router.post("/verify-payment", savePayment);

export default router;