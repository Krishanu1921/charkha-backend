import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);

//protected routes...
authRouter.route("/logout").post(verifyJWT , logoutUser);
authRouter.route("/refresh-token").post(refreshAccessToken);

export default authRouter;
