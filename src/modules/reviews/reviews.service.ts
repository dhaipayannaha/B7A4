import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./reviews.interface";

const createReview = async (payload: ICreateReview, customerId: string) => {
    const { rentalOrderId, gearItemId, rating, comment } = payload;

    // Check if the rental exists and belongs to this customer
    const rentalOrder = await prisma.rentalOrder.findFirst({
        where: {
            id: rentalOrderId,
            customerId,
            gearItemId,
        },
    });

    if (!rentalOrder) {
        throw new Error("Rental order not found for this gear and customer.");
    }

    if (rentalOrder.status !== "RETURNED") {
        throw new Error("You can only review gear after it has been returned.");
    }

    // Check if a review already exists
    const existingReview = await prisma.review.findFirst({
        where: {
            rentalOrderId,
            customerId,
            gearItemId,
        },
    });

    if (existingReview) {
        throw new Error("You have already reviewed this rental order.");
    }

    const result = await prisma.review.create({
        data: {
            rentalOrderId,
            gearItemId,
            customerId,
            rating,
            comment,
        },
        include: {
            gearItem: {
                select: { title: true },
            },
            customer: {
                select: { name: true, email: true },
            },
        },
    });

    return result;
};

export const reviewService = {
    createReview,
};