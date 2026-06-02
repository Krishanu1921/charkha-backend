// dotenv.config({
//     path : "./.env"
// });
import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import pkg from "jsonwebtoken";
import cors from 'cors'



import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";

import authRouter from "./src/routes/auth.routes.js";
import { categoryRouter } from "./src/routes/category.routes.js";
import productRouter from "./src/routes/product.routes.js";
import cartRouter from "./src/routes/cart.routes.js";
import userRouter from "./src/routes/user.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import paymentRouter from "./src/routes/payment.routes.js";

const {TokenExpiredError} = pkg;

const app = express();

/*console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});*/
const port = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,        // ← required for cookies to work
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/payment", paymentRouter);
/*app.post("/create-order", async (req, res) => {

    try {

        const options = {
            amount: 500 * 100,
            currency: "INR",
            receipt: "receipt_order_1"
        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating order");
    }

});*/

app.listen(8000, () => {
    console.log("Server running on port 8000");
});




// auth-routes-->
//     public-routes:
//         /api/v1/auth/register
//         /api/v1/auth/login
//     protected-routes:
//         /api/v1/auth/logout
//         /api/v1/auth/refresh-token

// category-routes-->
//     public-routes:
//         /api/v1/category/          //...(getAllCategories)
//         /api/v1/category/:id       //...(getCategoryById)
//     protected-routes:
//         /api/v1/category/create
//         /api/v1/category/update/:id
//         /api/v1/category/delete/:id
        
// product-routes-->
//     public-routes:
//         /api/v1/product/          //...(getAllProducts)
//         /api/v1/product/search
//         /api/v1/product/category/:categoryId
//         /api/v1/product/:id
//     protected-routes:
//         /api/v1/product/create
//         /api/v1/product/update/:id
//         /api/v1/product/stock/:id
//         /api/v1/product/images/:id
//         /api/v1/product/delete/:id

// cart-routes-->
//     public-routes:
//         /api/v1/cart/       //...(getCart)
//         /api/v1/cart/add
//         /api/v1/cart/update
//         /api/v1/cart/items/productId
//         /api/v1/cart/clear
