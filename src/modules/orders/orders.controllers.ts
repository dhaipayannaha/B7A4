import { catchAsync } from "../../utilities/catchAsync";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status";
import { orderService } from "./orders.service";
import { RentalStatus } from "@prisma/client"

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

    const validStatuses = Object.values(RentalStatus);
    if (!status || !validStatuses.includes(status)) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: `Invalid status. Valid values are: ${validStatuses.join(', ')}`,
            data: null,
        });
    }

    const result = await orderService.updateOrderStatus(orderId, providerId, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order status updated successfully",
        data: result,
    });
})


const getOrderById = catchAsync(async (req: Request, res: Response) => {
    const providerId = req.user?.id as string;
    const orderId = req.params.id as string;
    const result = await orderService.getOrderById(orderId, providerId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order retrieved successfully",
        data: result,
    });
})

export const OrderController = {
    getOrders,
    getOrderById,
    updateOrder,
}
