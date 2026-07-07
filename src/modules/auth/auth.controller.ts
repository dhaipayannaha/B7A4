
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { AuthService } from "./auth.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utilities/sendResponse";



const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const { accessToken, refreshToken } = await AuthService.loginUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: { accessToken, refreshToken },
    })

})

export const AuthController = {
    loginUser,
}