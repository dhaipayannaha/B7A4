import { prisma } from "../../lib/prisma"
import { IcreateReantal } from "./rental.interface"



const createRental = async (payload: IcreateReantal, userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        include: {
            rentalOrders: true
        }
    })

    const result = await prisma.rentalOrder.create({
        data: {
            ...payload,
            customerId: userId
        }
    })
    return result;
}

const getAllRentals = async (userId: string) => {
    const result = await prisma.rentalOrder.findMany({
        where: {
            customerId: userId
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

export const rentalService = {
    createRental,
    getAllRentals
}