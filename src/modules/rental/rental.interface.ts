import { RentalStatus } from "../../../generated/prisma/enums";

export interface CreateRentalPayload {
  gearItemId: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
}

export interface UpdateRentalStatusPayload {
  status: RentalStatus;
}