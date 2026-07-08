import { catchAsync } from "../../utilities/catchAsync";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status";
import { orderService } from "./orders.service";
import { RentalStatus } from "../../../generated/prisma/enums";

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

const updateOrder = catchAsync(async (req: Request, res: Response) => {
    const providerId = req.user?.id as string;
    const orderId = req.params.id as string;
    const { status } = req.body as { status: RentalStatus };

    const result = await orderService.updateOrderStatus(orderId, providerId, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order status updated successfully",
        data: result,
    });
})


export const OrderController = {
    getOrders,
    updateOrder,
}