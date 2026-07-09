import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { reviewService } from "./reviews.service";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const customerId = req.user?.id;

    const result = await reviewService.createReview(payload, customerId as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review created successfully",
        data: result,
    });
});

export const reviewController = {
    createReview,
};