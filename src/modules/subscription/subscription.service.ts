import { SubscriptionStatus } from "../../../generated/prisma/enums";
import Stripe from "stripe";

import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import {
  handleChangeSubscription,
  handleCheckoutCompleted,
} from "./subscription.utilis";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });
    // old subscriber
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    // new subscriber
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { userId: user.id },
    });
    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.updated":
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);

      await handleChangeSubscription(event.data.object);
      break;
    //   stripe subscriptions cancel sub_1TorLg87OBIsCVmWwtXbgt2i commend run terminal

    case "customer.subscription.deleted":
      await handleChangeSubscription(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`No event matched . Unhandled event type ${event.type}.`);
      break;
  }
};

const getSubscriptionStatus = async (userId: string) => {
  const isSubscriptionExist = await prisma.subscription.findFirstOrThrow({
    where: {
      userId,
    },
  });
  const isActive =
    isSubscriptionExist.status === "ACTIVE" &&
    isSubscriptionExist.currentPeriodEnd &&
    new Date(isSubscriptionExist.currentPeriodEnd) > new Date();

  return {
    status: isSubscriptionExist.status,
    isSubscribed: isActive,
    currentPeriodEnd: isSubscriptionExist.currentPeriodEnd,
  };
};

const cancelSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
    },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  if (!subscription.stripeSubscriptionId) {
    throw new Error("Stripe subscription not found");
  }

  // Update database
  const result = await prisma.subscription.update({
    where: {
      id: subscription.id,
    },
    data: {
      status: SubscriptionStatus.CANCELED,
      currentPeriodEnd: new Date(),
    },
  });

  return {
    result,
  };
};


const cancelSubscriptionPeriodEnd = async (userId: string) => {
  const subscription = await prisma.subscription.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const stripeSubscription = await stripe.subscriptions.update(
    subscription.stripeSubscriptionId,
    
    {
      cancel_at_period_end: true,
    }
  );

  return {
    id: stripeSubscription.id,
    status: stripeSubscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd, 
  };
};
export const subscriptionServices = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription,
  cancelSubscriptionPeriodEnd,
};
