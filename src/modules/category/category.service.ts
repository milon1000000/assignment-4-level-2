import { prisma } from "../../lib/prisma";
import { CreateCategoryPayload, IUpdateCategory } from "./category.interface";

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
    const category=await prisma.category.findMany({
        orderBy:{
            createdAt:"desc"
        }
    });

    if(category.length===0){
        throw new Error("No categories found")
    };

    return category
};

const updateCategory = async (payload:IUpdateCategory,categoryId:string) => {
    const{name,description}=payload;
    const category=await prisma.category.findUnique({
        where:{
            id:categoryId
        }
    });

    if(!category){
        throw new Error("No categoris found")
    };

    if (name) {
    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    });
 
     if (existingCategory && existingCategory.id !== categoryId) {
      throw new Error("Category already exists");
    }
  }

   const updateCategory=await prisma.category.update({
    where:{
        id:categoryId
    },
   data: {
  ...(name && { name }),
  ...(description && { description }),
}
   });
   return updateCategory;
};

const deleteCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return null;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
