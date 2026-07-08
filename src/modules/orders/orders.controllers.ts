import { catchAsync } from "../../utilities/catchAsync";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status";
import { orderService } from "./orders.service";

const getOrders = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user?.id;
    const result = await orderService.getAllOrders(userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result,
    });
})


export const OrderController = {
    getOrders,
}