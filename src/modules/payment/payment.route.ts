import express from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post(
  "/create",
  auth(Role.CUSTOMER),
  paymentController.createPayment
);

router.post(
  "/confirm",
  paymentController.confirmPayment
);

router.get(
  "/",
  auth(Role.CUSTOMER),
  paymentController.getMyPayments
);

router.get(
  "/:id",
  auth(Role.CUSTOMER),
  paymentController.getSinglePayment
);

export const PaymentRoutes = router;