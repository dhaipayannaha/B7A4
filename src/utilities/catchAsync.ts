import { Request, RequestHandler, Response, NextFunction } from "express"
import httpStatus from "http-status"

export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        } catch (error: any) {
            console.log(error)
            // res.status(httpStatus.BAD_REQUEST).json({
            //     success: false,
            //     statusCode: httpStatus.BAD_REQUEST,
            //     message: error.message
            // })

            next(error);
            //this error come from global error and it presents app.ts in bottom side
        }
    }
}