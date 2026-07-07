import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const customerId = req.user?.id;

  const result = await rentalService.createRental(
    payload,
    customerId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental created successfully",
    data: result,
  });
});

const getMyRentals = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id;

  const result = await rentalService.getMyRentals(customerId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rentals retrieved successfully",
    data: result,
  });
});

const getSingleRental = catchAsync(async (req: Request, res: Response) => {
  const rentalId = req.params.id;
  const customerId = req.user?.id;

  const result = await rentalService.getSingleRental(
    rentalId as string,
    customerId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental retrieved successfully",
    data: result,
  });
});

const cancelRental = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalId = req.params.id;
    const customerId = req.user?.id;

    const result = await rentalService.cancelRental(
      rentalId as string,
      customerId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental cancelled successfully",
      data: result,
    });
  },
);

const getProviderOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id;
    const result = await rentalService.getProviderOrders(providerId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Provider orders retrieved successfully",
      data: result,
    });
  },
);

const updateRentalStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalId = req.params.id;
    const providerId = req.user?.id;
    const payload = req.body;

    const result = await rentalService.updateRentalStatus(
      rentalId as string,
      providerId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental status updated successfully",
      data: result,
    });
  },
);

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getAllRentals();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All rentals retrieved successfully",
    data: result,
  });
});

export const rentalController = {
  createRental,
  getMyRentals,
  getSingleRental,
  cancelRental,
  getProviderOrders,
  updateRentalStatus,
  getAllRentals,
};
