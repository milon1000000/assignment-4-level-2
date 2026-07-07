import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createRental = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // service call
    // sendResponse
  }
);

const getMyRentals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // service call
    // sendResponse
  }
);

const getSingleRental = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // service call
    // sendResponse
  }
);

const cancelRental = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // service call
    // sendResponse
  }
);

const getProviderOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // service call
    // sendResponse
  }
);

const updateRentalStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // service call
    // sendResponse
  }
);

const getAllRentals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // service call
    // sendResponse
  }
);

export const rentalController = {
  createRental,
  getMyRentals,
  getSingleRental,
  cancelRental,
  getProviderOrders,
  updateRentalStatus,
  getAllRentals,
};