import { prisma } from "../../lib/prisma";
import { IGearItem, IGearQuery } from "./gear.interface";

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


const updateGear = async (postId: string, payload: IGearItem, authorId: string, isAdmin: boolean) => {
    const gear = await prisma.gearItem.findUnique({
        where: {
            id: postId
        }
    })


    if (!isAdmin && gear?.providerId !== authorId) {
        throw new Error("You are not authorized to update this post");
    }

    const result = await prisma.gearItem.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            provider: {
                omit: {
                    password: true
                }
            },
            category: true
        }
    })
    return result;


}

const deleteGear = async (postId: string, authorId: string, isAdmin: boolean) => {
    const gear = await prisma.gearItem.findUnique({
        where: {
            id: postId
        }
    })

    if (!isAdmin && gear?.providerId !== authorId) {
        throw new Error("You are not authorized to delete this post");
    }

    const result = await prisma.gearItem.delete({
        where: {
            id: postId
        }
    })
    return result;
}

const getAllGear = async (query: IGearQuery) => {
    const { searchTerm, category, brand, minPrice, maxPrice, condition, status } = query;

    const result = await prisma.gearItem.findMany({
        where: {
            ...(category && {
                category: { name: { equals: category, mode: "insensitive" } },
            }),
            ...(brand && { brand: { equals: brand, mode: "insensitive" } }),
            ...(condition && { condition }),
            ...(status && { status }),
            ...(minPrice !== undefined || maxPrice !== undefined
                ? {
                    dailyRate: {
                        ...(minPrice !== undefined && { gte: Number(minPrice) }),
                        ...(maxPrice !== undefined && { lte: Number(maxPrice) }),
                    },
                }
                : {}),
            ...(searchTerm && {
                OR: [
                    { title: { contains: searchTerm, mode: "insensitive" } },
                    { brand: { contains: searchTerm, mode: "insensitive" } },
                    { model: { contains: searchTerm, mode: "insensitive" } },
                ],
            }),
        },
        include: {
            provider: {
                omit: {
                    password: true,
                },
            },
            category: true,
        },
    });
    return result;
}

const getSingleGear = async (postId: string) => {
    const result = await prisma.gearItem.findUnique({
        where: {
            id: postId
        },
        include: {
            provider: {
                omit: {
                    password: true
                }
            },
            category: true
        }
    })
    return result;

}

export const providerService = {
    createGear,
    updateGear,
    deleteGear,
    getAllGear,
    getSingleGear
};