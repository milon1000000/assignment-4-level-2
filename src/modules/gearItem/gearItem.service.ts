import { Role } from "../../../generated/prisma/enums";
import { GearItemWhereInput } from "./../../../generated/prisma/internal/prismaNamespace";

import { prisma } from "../../lib/prisma";
import {
  CreateGearItemPayload,
  UpdateGearItemPayload,
} from "./gearItem.interface";
import { IGearQuery } from "./gearItem.interface";

const createGearItem = async (
  payload: CreateGearItemPayload,
  providerId: string,
) => {
  const {
  name,
  description,
  image,
  brand,
  condition,
  pricePerDay,
  stock,
  categoryId,
} = payload;

if (!name) {
  throw new Error("Name is required");
}

if (!description) {
  throw new Error("Description is required");
}

if (!image) {
  throw new Error("Image is required");
}

if (!brand) {
  throw new Error("Brand is required");
}

if (pricePerDay === undefined || pricePerDay === null) {
  throw new Error("Price per day is required");
}

if (pricePerDay <= 0) {
  throw new Error("Price per day must be greater than 0");
}

if (stock === undefined || stock === null) {
  throw new Error("Stock is required");
}

if (stock < 0) {
  throw new Error("Stock cannot be negative");
}

if (!categoryId) {
  throw new Error("Category is required");
}

   

  // Check provider
  const provider = await prisma.user.findUnique({
    where: {
      id: providerId,
    },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  if (provider.role !== Role.PROVIDER) {
    throw new Error("Only providers can create gear items");
  }

  // Check category
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const available = stock > 0;

  const result = await prisma.gearItem.create({
    data: {
      name,
      description,
      image,
      brand,
      condition,
      pricePerDay,
      stock,
      available,
      providerId,
      categoryId,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getAllGearItems = async (query: IGearQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: GearItemWhereInput[] = [];

  // Search
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },

        {
          brand: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Category Filter
  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  // Brand Filter
  if (query.brand) {
    andConditions.push({
      brand: {
        equals: query.brand,
        mode: "insensitive",
      },
    });
  }

  // Availability Filter
  if (query.available !== undefined) {
    andConditions.push({
      available: query.available === "true",
    });
  }

  // Min Price
  if (query.minPrice) {
    andConditions.push({
      pricePerDay: {
        gte: Number(query.minPrice),
      },
    });
  }

  // Max Price
  if (query.maxPrice) {
    andConditions.push({
      pricePerDay: {
        lte: Number(query.maxPrice),
      },
    });
  }

  const gearItems = await prisma.gearItem.findMany({
    where: {
      AND: andConditions,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.gearItem.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: gearItems,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleGearItem = async (gearId: string) => {
  const gear = await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearId,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return gear;
};

const getMyGearItems = async (providerId: string) => {
  const provider = await prisma.user.findUnique({
    where: {
      id: providerId,
    },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  if (provider.role !== Role.PROVIDER) {
    throw new Error("Only provider can access this data");
  }

  const gearItems = await prisma.gearItem.findMany({
    where: {
      providerId,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return gearItems;
};

const updateGearItem = async (
  gearItemId: string,
  payload: UpdateGearItemPayload,
  providerId: string,
) => {
  const {
    name,
    description,
    image,
    brand,
    condition,
    pricePerDay,
    stock,
    categoryId,
  } = payload;

  const gearItem = await prisma.gearItem.findFirstOrThrow({
    where: {
      id: gearItemId,
    },
  });

  

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  if (gearItem.providerId !== providerId) {
    throw new Error("You are not the owner of this gear item");
  }

  const result = await prisma.gearItem.update({
    where: {
      id: gearItemId,
    },
    data: {
      ...(name && { name }),
      ...(description && { description }),
      ...(image && { image }),
      ...(brand && { brand }),
      ...(condition && { condition }),

      ...(pricePerDay && {
        pricePerDay,
      }),

      ...(stock && {
        stock,
        available: stock > 0,
      }),

      ...(categoryId && {
        categoryId,
      }),
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const deleteGearItem = async (
  gearItemId: string,
  providerId: string,
) => {
  const gearItem = await prisma.gearItem.findFirstOrThrow({
    where: {
      id: gearItemId,
    },
  });

  if (gearItem.providerId !== providerId) {
    throw new Error("You are not the owner of this gear item");
  }

  const result = await prisma.gearItem.delete({
    where: {
      id: gearItemId,
    },
  });

  return null;
};

export const gearItemService = {
  createGearItem,
  getAllGearItems,
  getSingleGearItem,
  getMyGearItems,
  updateGearItem,
  deleteGearItem,
};
