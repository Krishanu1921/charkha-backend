import "./src/config/loadEnv.js";
import express from "express";
import pkg from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";

console.log("PORT =", process.env.PORT);
console.log("MONGODB_URI =", process.env.MONGODB_URI);
console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);

import connectDB from "./src/config/db.js";

import authRouter from "./src/routes/auth.routes.js";
import { categoryRouter } from "./src/routes/category.routes.js";
import productRouter from "./src/routes/product.routes.js";
import cartRouter from "./src/routes/cart.routes.js";
import userRouter from "./src/routes/user.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import paymentRouter from "./src/routes/payment.routes.js";

const { TokenExpiredError } = pkg;

const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/payment", paymentRouter);

// Health Check Route
app.get("/", (req, res) => {
    res.send("Charkha backend is running 🚀");
});

// Start Server - Connect DB first, then start listening
(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();



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
