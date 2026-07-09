import { catchAsync } from "../../utilities/catchAsync";
import { NextFunction, Request, Response } from "express";
import { paymentServices } from "./payment.service";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status";

const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await paymentServices.createCheckoutSession(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "checkout completed successfully",
        data: result
    })
})

const confirmPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { transactionId, rentalOrderId } = req.body;
    
    // We can allow falling back to query parameters if preferred by some clients
    const tId = transactionId || req.query.transactionId;
    const rId = rentalOrderId || req.query.rentalOrderId;

    if (!tId) {
        throw new Error("Transaction ID is required");
    }

    const result = await paymentServices.confirmPayment(tId as string, rId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment confirmed successfully",
        data: result
    })
})

const getPaymentHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await paymentServices.getPaymentHistory(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment history retrieved successfully",
        data: result
    })
})

const getPaymentDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await paymentServices.getPaymentDetails(id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment details retrieved successfully",
        data: result
    })
})

export const paymentController = {
    createCheckoutSession,
    confirmPayment,
    getPaymentHistory,
    getPaymentDetails
}
