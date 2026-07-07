import { prisma } from "../../lib/prisma";
import { IGearItem } from "./provider.interface";

const createGear = async (providerId: string, payload: IGearItem) => {
    const { categoryId, ...restPayload } = payload;

    if (!categoryId) {
        throw new Error("Category id is required");
    }

    // Optional but recommended: verify category actually exists before hitting Prisma,
    // so you get a clean 404 instead of a Prisma validation/foreign-key error.
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    const result = await prisma.gearItem.create({
        data: {
            ...restPayload,
            provider: {
                connect: { id: providerId },
            },
            category: {
                connect: { id: categoryId },
            },
        },
    });

    return result;
};

export const providerService = {
    createGear
};