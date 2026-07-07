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

const getAllGear = catchAsync(async (req: Request, res: Response) => {
    const { searchTerm, category, brand, minPrice, maxPrice, condition, status } = req.query;

    const result = await providerService.getAllGear({
        searchTerm: searchTerm as string | undefined,
        category: category as string | undefined,
        brand: brand as string | undefined,
        minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
        condition: condition as any,
        status: status as any,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear items fetched successfully",
        data: result,
    });
})

const getSingleGear = catchAsync(async (req: Request, res: Response) => {
    const { id: postId } = req.params;

    if (!postId) {
        throw new Error("Gear Id Required in Params")
    }

    const result = await providerService.getSingleGear(postId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear item fetched successfully",
        data: result
    })

})

export const providerController = {
    createGear,
    updateGear,
    deleteGear,
    getAllGear,
    getSingleGear
}

function async(arg0: (req: Request, res: Response) => void): import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> {
    throw new Error("Function not implemented.");
}
