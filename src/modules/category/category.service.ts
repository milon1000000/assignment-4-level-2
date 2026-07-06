import { prisma } from "../../lib/prisma";
import { CreateCategoryPayload } from "./category.interface";

const createCategory = async (payload: CreateCategoryPayload) => {
  const { name, description } = payload;

  if (!name) {
    throw new Error("name is required");
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return category;
};

const getAllCategories = async () => {
    const category=await prisma.category.findMany();

    if(category.length===0){
        throw new Error("No categories found")
    };

    return category
};

const updateCategory = async () => {};

const deleteCategory = async () => {};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
