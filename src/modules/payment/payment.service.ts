import Stripe from "stripe";
import {
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  RentalStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted } from "./payment.utils";
import { CreatePaymentPayload } from "./payment.interface";

const createPayment = async (
  payload: CreatePaymentPayload,
  customerId: string,
) => {
  const { rentalOrderId } = payload;

  const { rentalOrder, customer } = await prisma.$transaction(async (tx) => {
    const rentalOrder = await tx.rentalOrder.findUnique({
      where: { id: rentalOrderId },
    });

    if (!rentalOrder) {
      throw new Error("Rental order not found");
    }

    if (rentalOrder.customerId !== customerId) {
      throw new Error("You are not authorized to pay for this rental");
    }

    if (rentalOrder.status === RentalStatus.CANCELLED) {
      throw new Error("Cancelled rental cannot be paid");
    }
    if (rentalOrder.status === RentalStatus.RETURNED) {
      throw new Error("Returned rental cannot be paid");
    }

    if (rentalOrder.status !== RentalStatus.CONFIRMED) {
  throw new Error("Rental order is not confirmed.");
}
    const existingPayment = await tx.payment.findUnique({
      where: { rentalOrderId },
    });

    if (existingPayment?.status === PaymentStatus.COMPLETED) {
      throw new Error("Payment already completed");
    }

    const customer = await tx.user.findUniqueOrThrow({
      where: { id: customerId },
    });

    return { rentalOrder, customer };
  });

  const amount = rentalOrder.totalPrice;
  console.log(amount);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: customer.email,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: "Gear Rental",
            description: `Rental Order #${rentalOrder.id}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment/cancel`,
    metadata: {
      rentalOrderId: rentalOrder.id,
      customerId,
    },
  });

  await prisma.$transaction(async (tx) => {
    const finalCheck = await tx.payment.findUnique({
      where: { rentalOrderId },
    });

    if (finalCheck?.status === PaymentStatus.COMPLETED) {
      throw new Error("Payment already completed by another request");
    }

    await tx.payment.upsert({
      where: { rentalOrderId },
      update: {
        status: PaymentStatus.PENDING,
        amount,
      },
      create: {
        rentalOrderId,
        customerId,
        amount,
        provider: PaymentProvider.STRIPE,
        method: PaymentMethod.CARD,
        status: PaymentStatus.PENDING,
      },
    });
  });

  return {
    paymentUrl: session.url,
  };
};

const confirmPayment = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session,
      );

      break;

    default:
      console.log("Unhandled Event");
  }

  return {
    received: true,
  };
};

const getMyPayments = async (customerId: string) => {
  const payments = await prisma.payment.findMany({
  where: {
    customerId,
  },
  include: {
    rentalOrder: {
      include: {
        gearItem: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});
  return payments;
};

const getSinglePayment = async (paymentId: string) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      id: paymentId,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      rentalOrder: {
        include: {
          gearItem: {
            omit: {
              stock: true,
            },
          },
        },
      },
    },
  });

  return payment;
};

export const paymentService = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getSinglePayment,
};
