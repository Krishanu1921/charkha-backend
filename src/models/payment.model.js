import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    orderId: {
        type: String,
        required: true
    },

    razorpayPaymentId: {
        type: String
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "INR"
    },

    address: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created"
    }
},
{
    timestamps: true
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;