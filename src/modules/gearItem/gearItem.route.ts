import { auth } from './../../middlewares/auth';
import { Router } from "express";
import { gearItemController } from "./gearItem.controller";
import { Role } from '../../../generated/prisma/enums';

const router = Router();

// routes
router.post("/",auth(Role.PROVIDER),gearItemController.createGearItem);
router.get("/",gearItemController.getAllGearItems);
router.get("/:id",gearItemController.getSingleGearItem);
router.patch("/:id",auth(Role.PROVIDER,Role.ADMIN),gearItemController.updateGearItem);
router.delete("/:id",auth(Role.PROVIDER,Role.ADMIN),gearItemController.deleteGearItem);
router.get(
  "/provider/gear",
  auth(Role.PROVIDER),
  gearItemController.getMyGearItems
);

export const gearItemRoutes = router;