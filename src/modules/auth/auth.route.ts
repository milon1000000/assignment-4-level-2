import { auth } from './../../middlewares/auth';
import { Router } from "express";
import { authController } from "./auth.controller";
import { Role } from '../../../generated/prisma/enums';

const router=Router();

router.post("/register",authController.registerUser);

router.post("/login",authController.loginUser);
router.get("/me",auth(Role.CUSTOMER,Role.PROVIDER,Role.ADMIN),authController.getMyProfile)

export const authRoutes=router;