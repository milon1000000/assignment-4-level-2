import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from './user.service';

const updateMyProfile = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const userId = req.user?.id;

    const result = await userService.updateMyProfile(
      userId as string,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile updated successfully",
      data: result,
    });
  }
);

const deleteMyProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    await userService.deleteMyProfile(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile deleted successfully",
      data: null,
    });
  }
);

export const userController = {
  updateMyProfile,
  deleteMyProfile,
};