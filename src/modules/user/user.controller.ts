import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";


const registerUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const user = await userService.registerUserIntoDB(payload);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "User registered successfully",
            data: user,
        });
    }
);


const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string;

    const profile = await userService.getMyProfileFromDB(userId);



    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile fetched successfully",
        data: {
            profile
        }
    })
})




export const UserController = {
    registerUser,
    getMyProfile
};