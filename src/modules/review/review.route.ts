import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  reviewController.createReview
);

router.get(
  "/my",
  auth(Role.CUSTOMER),
  reviewController.getMyReviews
);

router.get(
  "/gear/:gearId",
  reviewController.getGearReviews
);

router.patch(
  "/:id",
  auth(Role.CUSTOMER),
  reviewController.updateReview
);

router.delete(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  reviewController.deleteReview
);

export const reviewRoutes = router;