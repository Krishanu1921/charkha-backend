import { razorpay } from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET =", process.env.RAZORPAY_KEY_SECRET);

export const createPaymentOrder = async (req, res) => {
    try {

        const { amount, address, userId } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR"
        });

        const payment = await Payment.create({
            user: userId,
            orderId: order.id,
            amount,
            address,
            status: "created"
        });

        res.status(200).json({
            success: true,
            order,
            payment
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const savePayment = async (req, res) => {
    try {

        const {
            razorpay_payment_id,
            razorpay_order_id
        } = req.body;

        await Payment.findOneAndUpdate(
            {
                orderId: razorpay_order_id
            },
            {
                razorpayPaymentId: razorpay_payment_id,
                status: "paid"
            }
        );

        res.status(200).json({
            success: true
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};