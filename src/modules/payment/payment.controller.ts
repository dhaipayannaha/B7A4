import { catchAsync } from "../../utilities/catchAsync";
import { NextFunction, Request, Response } from "express";
import { paymentServices } from "./payment.service";


const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await paymentServices.createCheckoutSession(userId as string)

})


export const paymentController = {
    createCheckoutSession
}
