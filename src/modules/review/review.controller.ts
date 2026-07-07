import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";
import { Role } from "../../../generated/prisma/enums";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const customerId = req.user?.id;

  const result = await reviewService.createReview(
    payload,
    customerId as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getGearReviews = catchAsync(async (req: Request, res: Response) => {
  const gearItemId = req.params.gearId;
  

  const result = await reviewService.getGearReviews(gearItemId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id;

  const result = await reviewService.getMyReviews(customerId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My reviews retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const customerId = req.user?.id;
  const payload = req.body;

  const result = await reviewService.updateReview(
    reviewId as string,
    customerId as string,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const userId = req.user?.id;
  const isAdmin = req.user?.role===Role.ADMIN;

  const result = await reviewService.deleteReview(
    reviewId as string,
    userId as string,
    isAdmin
    
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getGearReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};