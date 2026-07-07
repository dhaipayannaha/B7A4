import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
    const result = await prisma.category.findMany();
    return result;
};

export const categoryService = {
    getAllCategories
};
