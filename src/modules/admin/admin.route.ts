import { Router } from "express";
import { adminController } from "./admin.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);

router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);

router.get("/gear", auth(Role.ADMIN), adminController.getAllGear);


export const adminRoutes = router;