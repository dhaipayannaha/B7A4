import { Request, Response } from "express";
import { categoryService } from "./category.service";
import httpStatus from "http-status";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategories();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Categories fetched successfully",
        data: result,
    });
});

export const categoryController = {
    getAllCategories
};
