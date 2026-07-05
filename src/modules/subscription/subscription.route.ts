import { auth } from './../../middlewares/auth';
import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { Role } from '../../../generated/prisma/enums';

const router=Router();

router.post("/checkout",auth(Role.ADMIN,Role.AUTHOR,Role.USER),subscriptionController.createCheckoutSession);
router.post("/webhook",subscriptionController.handleWebhook);
router.post(
  "/cancel",
  auth(),
  subscriptionController.cancelSubscription
);

router.post(
  "/cancelPeriod",
  auth(Role.USER,Role.AUTHOR,Role.ADMIN),
  subscriptionController.cancelSubscriptionPeriodEnd
);
router.get("/status",auth(Role.USER,Role.AUTHOR,Role.ADMIN),subscriptionController.getSubscriptionStatus)

export const subscriptionRoutes=router;