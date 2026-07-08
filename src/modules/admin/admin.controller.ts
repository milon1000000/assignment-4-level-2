import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import { Role } from "../../../generated/prisma/enums";

const getAllUsers = catchAsync(async (req, res) => {
  const isAdmin = req.user?.role === Role.ADMIN;
  console.log(isAdmin);
  const result = await adminService.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const payload = req.body;

  const result = await adminService.updateUserStatus(userId as string, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllGear = catchAsync(async (req, res) => {
  const result = await adminService.getAllGear();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear retrieved successfully",
    data: result,
  });
});



export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
};
