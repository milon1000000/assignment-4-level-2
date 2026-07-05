import { Role } from "../../../generated/prisma/enums";


export interface ILoginUser{
    email:string,
    password:string
}




export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  role?: Role
}