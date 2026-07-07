import { prisma } from "../../lib/prisma";
import { CreateReviewPayload, UpdateReviewPayload } from "./review.interface";
import { RentalStatus } from "../../../generated/prisma/enums";

const createReview = async (
  payload: CreateReviewPayload,
  customerId: string,
) => {
  const { gearItemId, rating, comment } = payload;

  if (!gearItemId) {
    throw new Error("Gear item id is required");
  }

  if (rating === undefined || rating === null) {
    throw new Error("Rating is required");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const customer = await prisma.user.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const gearItem = await prisma.gearItem.findUnique({
    where: {
      id: gearItemId,
    },
  });

  if (!gearItem) {
    throw new Error("Gear item not found");
  }

  const rental = await prisma.rentalOrder.findFirst({
    where: {
      customerId,
      gearItemId,
      status: RentalStatus.RETURNED,
    },
  });

  if (!rental) {
    throw new Error(
      "You can review only gear that you have rented and returned",
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      gearItemId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this gear");
  }

  const review = await prisma.review.create({
    data: {
      customerId,
      gearItemId,
      rating,
      comment,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gearItem: {
        select: {
          id: true,
          name: true,
          image: true,
          brand: true,
        },
      },
    },
  });

  return review;
};
const getGearReviews = async (gearItemId: string) => {
  if (!gearItemId) {
    throw new Error("Gear item id is required");
  }

  const gearItem = await prisma.gearItem.findUnique({
    where: {
      id: gearItemId,
    },
  });

  if (!gearItem) {
    throw new Error("Gear item not found");
  }

  const reviews = await prisma.review.findMany({
    where: {
      gearItemId,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const reviewStats = await prisma.review.aggregate({
    where: {
      gearItemId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      id: true,
    },
  });

  return {
    averageRating: reviewStats._avg.rating ?? 0,
    totalReviews: reviewStats._count.id,
    reviews,
    reviewStats,
  };
};

const getMyReviews = async (customerId: string) => {
  if (!customerId) {
    throw new Error("customerId is required");
  }

  const reviews = await prisma.review.findMany({
    where: {
      customerId,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const reviewStats = await prisma.review.aggregate({
    where: {
      customerId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      id: true,
    },
  });

  return {
    averageRating: reviewStats._avg.rating ?? 0,
    totalReviews: reviewStats._count.id,
    reviews,
  };
};

const updateReview = async (
  reviewId: string,
  customerId: string,
  payload: UpdateReviewPayload,
) => {
  const { rating, comment } = payload;

  if (!reviewId) {
    throw new Error("Review id is required");
  }

  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.customerId !== customerId) {
    throw new Error("You are not authorized to update this review");
  }

  if (rating !== undefined && (rating < 1 || rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  const updatedReview = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      ...(rating && { rating }),
      ...(comment && { comment }),
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gearItem: {
        select: {
          id: true,
          name: true,
          image: true,
          brand: true,
        },
      },
    },
  });

  return updatedReview;
};

const deleteReview = async (
  reviewId: string,
  userId: string,
  isAdmin: boolean,
) => {
  if (!reviewId) {
    throw new Error("Review id is required");
  }

  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (!isAdmin && review.customerId !== userId) {
    throw new Error("You are not authorized to delete this review");
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  return null;
};

export const reviewService = {
  createReview,
  getGearReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};
