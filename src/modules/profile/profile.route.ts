import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { profileController } from "./profile.controller";
import { Role } from "../../../generated/prisma/enums";
const router=Router();

router.put(
  "/",
  auth(Role.CUSTOMER,Role.CUSTOMER,Role.ADMIN),
  profileController.updateMyProfile
);

router.delete(
  "/",
  auth(Role.CUSTOMER),
  profileController.deleteMyProfile
);

export const profileRoutes=router;