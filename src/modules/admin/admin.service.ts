import { prisma } from "../../lib/prisma";
import { IUpdateStatus } from "./admin.interface";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    omit:{
        password:true
    }
  });

  return users;
};

const updateUserStatus = async (
  userId: string,
  payload: IUpdateStatus
) => {
  const { status } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(status && { status }),
    },
  });

  return result;
};

const getAllGear = async () => {
  const result= await prisma.gearItem.findMany({
    include: {
      provider: {
        omit:{
            password:true
        }
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};



export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
};