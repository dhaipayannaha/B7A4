import { catchAsync } from "../../utilities/catchAsync";
import { Request, Response, NextFunction } from "express";
import { rentalService } from "./rental.service";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status";



const createRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id;
    const result = await rentalService.createRental(payload, userId as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Rental created successfully",
        data: result,
    });
})

export const rentalController = {
    createRental
}