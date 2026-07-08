import { ActiveStatus } from "../../../generated/prisma/enums";

export interface IUpdateStatus {
  status?: ActiveStatus;
}