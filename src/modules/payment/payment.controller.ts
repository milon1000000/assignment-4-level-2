import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const customerId = req.user?.id;
    const payload=req.body;
    const result = await paymentService.createPayment(
        payload,
      customerId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Payment session created successfully",
      data: result,
    });
  }
);

const confirmPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   const signature = req.headers["stripe-signature"] as string;
   const payload=req.body;

    const result = await paymentService.confirmPayment(payload,signature);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed successfully",
      data: result,
    });
  }
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response) => {

    const customerId = req.user?.id;

    const result = await paymentService.getMyPayments(customerId as string);

    sendResponse(res,{
      success:true,
      statusCode:httpStatus.OK,
      message:"Payments retrieved successfully",
      data:result
    });

  }
);

const getSinglePayment = catchAsync(
  async (req: Request, res: Response) => {

    const paymentId = req.params.id;

    const result = await paymentService.getSinglePayment(paymentId as string);

    sendResponse(res,{
      success:true,
      statusCode:httpStatus.OK,
      message:"Payment retrieved successfully",
      data:result
    });

  }
);

export const paymentController = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getSinglePayment,
};