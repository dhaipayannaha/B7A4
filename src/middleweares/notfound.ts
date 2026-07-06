import httpStatus from "http-status";
import { Request, Response } from "express";

export const notFound = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "Route not found"
            }
        ]
    })
}