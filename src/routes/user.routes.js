import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addAddress, changePassword, deleteAddress, deleteUser, getAddresses, getAllUsers, getProfile, updateAddress, updateProfile } from "../controllers/user.controller.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const userRouter = Router();

userRouter.route('/profile').get(verifyJWT, getProfile);
userRouter.route('/profile/update').put(verifyJWT, updateProfile);
userRouter.route('/change-password').put(verifyJWT, changePassword);

userRouter.route('/address').post(verifyJWT, addAddress);
userRouter.route('/address').get(verifyJWT, getAddresses);
userRouter.route('/address/:addressId').put(verifyJWT, updateAddress);
userRouter.route('/address/:addressId').delete(verifyJWT, deleteAddress);

userRouter.route('admin/users').get(verifyJWT, isAdmin, getAllUsers);
userRouter.route('/admin/delete/:id').delete(verifyJWT, isAdmin, deleteUser);

export default userRouter;