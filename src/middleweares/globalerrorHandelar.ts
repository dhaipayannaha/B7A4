import { Prisma } from "../../generated/prisma/client";
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { prisma } from "../lib/prisma";

export const globalErrorHandelar = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("ERROR", err);

    let statusCode;
    let errorMessage = err.message;
    let errorName = err.name || "Internal Server Error";


    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "You have provided incorrect field type or missing fields";
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "Duplicate key Error"
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "Invalid ID"
        } else if (err.code === "P2025") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "Record not found"
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P100") {
            statusCode = httpStatus[401]
            errorMessage = "Authantivcation failed"
        } else if (err.errorCode === "P1001") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "can't reach database server"
        }
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Error Occourd During Query Exucytion"
    }



    res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        name: errorName,
        message: errorMessage,
        error: err.stack
    })
}
