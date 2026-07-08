import { prisma } from "../../lib/prisma";




const getAllOrders = async (providerId: string) => {
    const result = await prisma.rentalOrder.findMany({
        where: {
            gearItem: {
                providerId: providerId
            }
        },
        include: {
            customer: true,
            _count: {
                select: {
                    reviews: true
                }
            }
        }
    })

    return result;
}


export const orderService = {
    getAllOrders
}