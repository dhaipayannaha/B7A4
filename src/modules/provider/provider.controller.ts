import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { providerService } from "./provider.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utilities/sendResponse";


const createGear = catchAsync(async (req: Request, res: Response) => {
    // providerId should come from the authenticated user (via auth middleware),
    // NOT from req.body — otherwise anyone could create gear under someone else's account.
    const providerId = req.user?.id;
    if (!providerId) {
        throw new Error("Unauthorized: User not found in request");
    }

    const result = await providerService.createGear(providerId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Gear item created successfully",
        data: result,
    });
});

const updateGear = catchAsync(async (req: Request, res: Response) => {

})


export const providerController = {
    createGear,
    updateGear
}