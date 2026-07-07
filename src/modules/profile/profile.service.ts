import { prisma } from "../../lib/prisma";
import { UpdateProfilePayload } from "./profile.ts.interface";

const updateMyProfile = async (
  userId: string,
  payload: UpdateProfilePayload
) => {
    const{name,phone,address,profileImage}=payload;
    if(!userId){
      throw new Error("userId is required")
    }
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
        ...(name && { name }),
        ...(phone && {phone}),
        ...(address && {address}),
        ...(profileImage && {profileImage})
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const deleteMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return null;
};

export const profileService = {
  updateMyProfile,
  deleteMyProfile,
};