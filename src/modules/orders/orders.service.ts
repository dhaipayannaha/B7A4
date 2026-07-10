import { prisma } from "../../lib/prisma";
import { RentalStatus } from "@prisma/client"




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

const getOrderById = async (orderId: string, providerId: string) => {
    const order = await prisma.rentalOrder.findFirst({
        where: {
            id: orderId,
            gearItem: {
                providerId: providerId
            }
        },
        include: {
            customer: true,
            gearItem: true,
            payment: true,
            reviews: true,
            _count: {
                select: {
                    reviews: true
                }
            }
        }
    });

    if (!order) {
        throw new Error("Order not found or you are not authorized to view it");
    }

    return order;
}

const updateOrderStatus = async (
    orderId: string,
    providerId: string,
    status: RentalStatus
) => {
    // Verify the order belongs to this provider before updating
    const order = await prisma.rentalOrder.findFirst({
        where: {
            id: orderId,
            gearItem: {
                providerId: providerId
            }
        }
    });

    if (!order) {
        throw new Error("Order not found or you are not authorized to update it");
    }

    const result = await prisma.rentalOrder.update({
        where: { id: orderId },
        data: { status },
        include: {
            customer: true,
            gearItem: true
        }
    });

    return result;
};

export const orderService = {
    getAllOrders,
    getOrderById,
    updateOrderStatus
}
