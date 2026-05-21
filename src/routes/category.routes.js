import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories,
        getCategoryById, updateCategory } from "../controllers/category.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const categoryRouter = Router();

categoryRouter.route("/").get(getAllCategories);
categoryRouter.route("/:id").get(getCategoryById);

//protected and role-based routes...
categoryRouter.route("/create").post(verifyJWT, isAdmin, createCategory);
categoryRouter.route("/update/:id").put(verifyJWT, isAdmin, updateCategory);
categoryRouter.route("/delete/:id").delete(verifyJWT, isAdmin, deleteCategory);

export {categoryRouter};