import { prisma } from "../../lib/prisma";
import { IGearItem, IUpdateGearItem, IGearQuery } from "./gear.interface";

const SAFE_PROVIDER_SELECT = {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
};

const createGear = async (providerId: string, payload: IGearItem) => {
    const { categoryName, ...restPayload } = payload;

    if (!categoryName) {
        throw new Error("Category name is required");
    }

    // Look up the category by name (case-insensitive)
    const category = await prisma.category.findFirst({
        where: { name: { equals: categoryName, mode: "insensitive" } },
    });

    if (!category) {
        throw new Error(`Category "${categoryName}" not found`);
    }

    const result = await prisma.gearItem.create({
        data: {
            ...restPayload,
            provider: {
                connect: { id: providerId },
            },
            category: {
                connect: { id: category.id },
            },
        },
    });

    return result;
};


const updateGear = async (postId: string, payload: IUpdateGearItem, authorId: string, isProvider: boolean) => {
    // 1. Verify the gear exists
    const gear = await prisma.gearItem.findUnique({ where: { id: postId } });

    if (!gear) {
        throw new Error("Gear item not found");
    }

    // 2. Provider must own the gear (admin bypass uses isProvider=false so skip check for them)
    if (isProvider && gear.providerId !== authorId) {
        throw new Error("You are not authorized to update this gear");
    }

    // 3. Separate categoryName (relation) from the rest of the prisma fields
    const { categoryName, ...rest } = payload;

    // 4. Remove undefined/null values so Prisma only updates provided fields
    const cleanData = Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v !== undefined && v !== null)
    );

    // 5. Resolve category relation if provided
    let categoryConnect = {};
    if (categoryName) {
        const category = await prisma.category.findFirst({
            where: { name: { equals: categoryName, mode: "insensitive" } },
        });
        if (!category) {
            throw new Error(`Category "${categoryName}" not found`);
        }
        categoryConnect = { category: { connect: { id: category.id } } };
    }

    // 6. Perform the partial update
    console.log("[DEBUG updateGear] cleanData:", cleanData);
    console.log("[DEBUG updateGear] categoryConnect:", categoryConnect);
    try {
        const result = await prisma.gearItem.update({
            where: { id: postId },
            data: { ...cleanData, ...categoryConnect },
            include: {
                provider: { select: SAFE_PROVIDER_SELECT },
                category: true,
            },
        });
        return result;
    } catch (error) {
        console.error("[DEBUG updateGear] Prisma Error:", error);
        throw error;
    }
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
                select: SAFE_PROVIDER_SELECT,
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
                select: SAFE_PROVIDER_SELECT
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