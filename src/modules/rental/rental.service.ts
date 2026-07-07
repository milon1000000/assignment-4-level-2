import { prisma } from "../../lib/prisma";
import { CreateRentalPayload, UpdateRentalStatusPayload } from "./rental.interface";
import { RentalStatus } from "../../../generated/prisma/enums";

const createRental = async (
  payload: CreateRentalPayload,
  customerId: string
) => {
  const { gearItemId, quantity, startDate, endDate } = payload;

  const customer = await prisma.user.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearItemId,
    },
  });

  if (!gear) {
    throw new Error("Gear item not found");
  }

  if (!gear.available) {
    throw new Error("Gear is not available for rental");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (gear.stock < quantity) {
    throw new Error("Insufficient stock available");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new Error("End date must be after start date");
  }

  const rentalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalPrice = rentalDays * quantity * gear.pricePerDay;

  const rental = await prisma.$transaction(async (tx) => {
    const createdRental = await tx.rentalOrder.create({
      data: {
        customerId,
        gearItemId,
        quantity,
        startDate: start,
        endDate: end,
        totalPrice,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        gearItem: {
            omit:{
                stock:true
            }
        },
      },
    });

    await tx.gearItem.update({
      where: {
        id: gearItemId,
      },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return createdRental;
  });

  return rental;
};



const getMyRentals = async (customerId:string) => {
 const rentals = await prisma.rentalOrder.findMany({
  where: {
    customerId,
  },
  include: {
    gearItem: {
        omit:{
            stock:true
        }
    },
    payment: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});
return rentals;
};

const getSingleRental = async (
  rentalId: string,
  customerId: string
) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      gearItem: true,
      payment: true,
    },
  });

  if (!rental) {
    throw new Error("Rental not found");
  }

  if (rental.customerId !== customerId) {
    throw new Error("You are not authorized to view this rental");
  }

  return rental;
};



const cancelRental = async (
  rentalId: string,
  customerId: string
) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalId,
    },
  });

  if (!rental) {
    throw new Error("Rental not found");
  }

  if (rental.customerId !== customerId) {
    throw new Error("You are not authorized to cancel this rental");
  }

  if (rental.status !== RentalStatus.PENDING) {
    throw new Error("Only pending rentals can be cancelled");
  }

  const cancelledRental = await prisma.$transaction(async (tx) => {
  // Update rental status
  const rental = await tx.rentalOrder.update({
    where: {
      id: rentalId,
    },
    data: {
      status: RentalStatus.CANCELLED,
    }
  });

  await tx.gearItem.update({
    where: {
      id: rental.gearItemId,
    },
    data: {
      stock: {
        increment: rental.quantity,
      },
    },
  });

  return rental;
});

return cancelledRental;

  return cancelledRental;
};

const getProviderOrders = async (providerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: {
      gearItem: {
        providerId,
      },
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gearItem: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

const updateRentalStatus = async (
  rentalId: string,
  providerId: string,
  payload: UpdateRentalStatusPayload
) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      gearItem: true,
    },
  });

  if (!rental) {
    throw new Error("Rental not found");
  }

  if (rental.gearItem.providerId !== providerId) {
    throw new Error("You are not authorized to update this rental");
  }

  if (
    payload.status !== RentalStatus.CONFIRMED &&
    payload.status !== RentalStatus.PICKED_UP &&
    payload.status !== RentalStatus.RETURNED
  ) {
    throw new Error(
      "Provider can only update status to CONFIRMED, PICKED_UP or RETURNED"
    );
  }

  if (
    rental.status === RentalStatus.CANCELLED ||
    rental.status === RentalStatus.RETURNED
  ) {
    throw new Error("Rental status can no longer be updated");
  }

  const updatedRental = await prisma.$transaction(async (tx) => {
   const updated = await tx.rentalOrder.update({
  where: {
    id: rentalId,
  },
  data: {
    status: payload.status,
  },
  include: {
    gearItem: {
      omit:{
        stock:true
      }
    },
    customer: {
      omit:{password:true}
    },
    payment: true,
  },
});

    if (payload.status === RentalStatus.RETURNED) {
      await tx.gearItem.update({
        where: {
          id: rental.gearItemId,
        },
        data: {
          stock: {
            increment: rental.quantity,
          },
          available: true,
        },
      });
    }

    return updated;
  });

  return updatedRental;
};

const getAllRentals = async () => {
  const rentals = await prisma.rentalOrder.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gearItem: {
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rentals;
};

export const rentalService = {
  createRental,
  getMyRentals,
  getSingleRental,
  cancelRental,
  getProviderOrders,
  updateRentalStatus,
  getAllRentals,
};