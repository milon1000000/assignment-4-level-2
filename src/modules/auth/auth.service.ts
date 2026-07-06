import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser, RegisterUserPayload } from "./auth.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, profileImage, phone, address, role } = payload;
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }
  if (role === Role.ADMIN) {
    throw new Error("Admin registration is not allowed.");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profileImage,
      phone,
      address,
      role: role ?? Role.CUSTOMER,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user.status === "SUSPENDED") {
    throw new Error("Your account has been suspened. Please contact support.");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  return { accessToken };
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    omit: {
      password: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const authService = {
  registerUserIntoDB,
  loginUser,
  getMyProfile,
};
