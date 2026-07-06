import httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";

const createCategory=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payload=req.body;

    const result=await categoryService.createCategory(payload);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"Category created successfully",
        data:result
    })

})

const getAllCategories=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const result=await categoryService.getAllCategories();

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Categories retrieved successfully",
        data:result
    })
    
})

const updateCategory=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const categoryId=req.params.id;
    const result=await categoryService.updateCategory(categoryId as string);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"update successfully",
        data:result
    })
    
})

const deleteCategory=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    
})

export const categoryController={
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
}