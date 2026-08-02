import { catchAsync } from "../../utilities/catchAsync";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status";
import { orderService } from "./orders.service";
import { RentalStatus, PaymentStatus } from "@prisma/client"

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
    const { status, paymentStatus } = req.body as { status?: RentalStatus; paymentStatus?: PaymentStatus };

    if (!status && !paymentStatus) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Provide at least one of 'status' or 'paymentStatus' to update.",
            data: null,
        });
    }

    if (status) {
        const validStatuses = Object.values(RentalStatus);
        if (!validStatuses.includes(status)) {
            return sendResponse(res, {
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: `Invalid status. Valid values are: ${validStatuses.join(', ')}`,
                data: null,
            });
        }
    }

    if (paymentStatus) {
        const validPaymentStatuses = Object.values(PaymentStatus);
        if (!validPaymentStatuses.includes(paymentStatus)) {
            return sendResponse(res, {
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: `Invalid paymentStatus. Valid values are: ${validPaymentStatuses.join(', ')}`,
                data: null,
            });
        }
    }

    const result = await orderService.updateOrderStatus(orderId, providerId, status, paymentStatus);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order updated successfully",
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
