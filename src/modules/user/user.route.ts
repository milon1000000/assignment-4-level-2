import { userController } from './user.controller';
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
const router=Router();

router.put(
  "/",
  auth(Role.CUSTOMER,Role.CUSTOMER,Role.ADMIN),
  userController.updateMyProfile
);

router.delete(
  "/",
  auth(Role.CUSTOMER),
  userController.deleteMyProfile
);

export const userRoutes=router;