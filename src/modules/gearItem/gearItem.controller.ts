import httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gearItemService } from "./gearItem.service";
import { sendResponse } from "../../utils/sendResponse";
import { Role } from '../../../generated/prisma/enums';

const createGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload=req.body;
    const providerId=req.user?.id;
    const result=await gearItemService.createGearItem(payload,providerId as string);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"Gear item created successfully",
        data:result
    })
  },
);

const getAllGearItems = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const result = await gearItemService.getAllGearItems(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear items retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleGearItem = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const gearId = req.params.id;

    const result = await gearItemService.getSingleGearItem(gearId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear item retrieved successfully",
      data: result,
    });
  }
);

const updateGearItem = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const providerId = req.user?.id;
    const isAdmin = req.user?.role === Role.ADMIN;

    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new Error("Gear Item Id is required in params");
    }

    const result = await gearItemService.updateGearItem(
      id as string,
      payload,
      providerId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear item updated successfully",
      data: result,
    });
  },
);

const deleteGearItem = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const providerId = req.user?.id;
    const isAdmin = req.user?.role === Role.ADMIN;

    const { id } = req.params;

    if (!id) {
      throw new Error("Gear Item Id is required in params");
    }

    const result = await gearItemService.deleteGearItem(
      id as string,
      providerId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear item deleted successfully",
      data: null,
    });
  },
);

export const gearItemController = {
  createGearItem,
  getAllGearItems,
  getSingleGearItem,
  updateGearItem,
  deleteGearItem,
};
