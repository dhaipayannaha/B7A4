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
    const authorId = req.user?.id;
    const isProvider = req.user?.role === "PROVIDER";
    const postId = req.params.id;
    const payload = req.body;

    const result = await providerService.updateGear(postId as string, payload, authorId as string, isProvider as boolean);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post updated successfully",
        data: result
    })
})

const deleteGear = catchAsync(async (req: Request, res: Response) => {

    const authorId = req.user?.id;
    const isProvider = req.user?.role === "PROVIDER";
    const postId = req.params.id;

    if (!postId) {
        throw new Error("Post Id Required in Params")
    }

    const result = await providerService.deleteGear(postId as string, authorId as string, isProvider as boolean);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gare deleted successfully",
        data: result
    })
})


export const providerController = {
    createGear,
    updateGear,
    deleteGear
}