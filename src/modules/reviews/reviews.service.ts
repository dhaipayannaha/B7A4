import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./reviews.interface";

const createReview = async (payload: ICreateReview, customerId: string) => {
    const { rentalOrderId, gearItemId, rating, comment } = payload;

    // Ensure the rental exists, belongs to this customer, and has been returned
    await prisma.rentalOrder.findFirstOrThrow({
        where: {
            id: rentalOrderId,
            customerId,
            gearItemId,
            status: "RETURNED",
        },
    });

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