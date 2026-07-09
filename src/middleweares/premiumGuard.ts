// @ts-nocheck
import { catchAsync } from "../utilities/catchAsync";
import { Request, Response, NextFunction } from "express";
import { SubscriptionStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const subscriptionGuird = () => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;

        const subscription = await prisma.subscription.findUnique({
            where: {
                userId: userId
            }
        });

        if (!subscription) {
            throw new Error("You are not subscribed to premium content");
        }

        if (subscription?.status !== SubscriptionStatus.ACTIVE) {
            throw new Error("You are not subscribed to premium content");
        }

        next();

    })
}