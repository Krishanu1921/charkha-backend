import { createProduct, deleteProduct, getAllProducts, getProductById, getProductsByCategory, searchProducts, updateProduct, updateStock, uploadProductImages } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
import Product from "../models/product.model.js";
import { Router } from "express";

const productRouter = Router();
//public routes...
productRouter.route("/").get(getAllProducts);
productRouter.route("/search").get(searchProducts);
productRouter.route("/category/:categoryId").get(getProductsByCategory);
productRouter.route("/:id").get(getProductById);

//protected admin routes...

productRouter.route("/create").post(verifyJWT, isAdmin, upload.array("images", 5), createProduct);
productRouter.route("/update/:id").put(verifyJWT, isAdmin, updateProduct);
productRouter.route("/stock/:id").patch(verifyJWT, isAdmin, updateStock);
productRouter.route("/images/:id").patch(verifyJWT, isAdmin, uploadProductImages);
productRouter.route("/delete/:id").delete(verifyJWT, isAdmin, deleteProduct);

export default productRouter;