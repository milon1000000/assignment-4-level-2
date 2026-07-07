import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { profileService } from "./profile.service";
import { sendResponse } from "../../utils/sendResponse";

const updateMyProfile = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const userId = req.user?.id;

    const result = await profileService.updateMyProfile(
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

    await profileService.deleteMyProfile(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile deleted successfully",
      data: null,
    });
  }
);

export const profileController = {
  updateMyProfile,
  deleteMyProfile,
};