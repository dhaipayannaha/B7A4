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

const getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getAllUsersFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });

})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await userService.updateUserFromDB(id as string, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
})


export const UserController = {
    registerUser,
    getMyProfile,
    getUsers,
    updateUser
};