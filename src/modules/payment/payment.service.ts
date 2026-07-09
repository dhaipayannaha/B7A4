import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import config from "../../config"

const createCheckoutSession = async (userId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Rental Order',
                        },
                        unit_amount: 500, // static price as requested
                    },
                    quantity: 1,
                },
            ],
            success_url: `${config.app_url}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.app_url}/cancel`,
            client_reference_id: userId,
        });

        return session;
    })
    
    return transactionResult;
}

const confirmPayment = async (transactionId: string, rentalOrderId?: string) => {
    const session = await stripe.checkout.sessions.retrieve(transactionId);
    
    if (session.payment_status !== 'paid') {
        throw new Error("Payment has not been completed");
    }

    let payment;
    if (rentalOrderId) {
        payment = await prisma.$transaction(async (tx) => {
            const existingPayment = await tx.payment.findUnique({
                where: { transactionId }
            });

            if (existingPayment) {
                return existingPayment;
            }

            const order = await tx.rentalOrder.findUnique({
                where: { id: rentalOrderId }
            });

            if (!order) {
                throw new Error("Rental Order not found");
            }

            const newPayment = await tx.payment.create({
                data: {
                    transactionId: transactionId,
                    rentalOrderId: rentalOrderId,
                    amount: session.amount_total || 500,
                    status: 'COMPLETED',
                    paidAt: new Date()
                }
            });

            await tx.rentalOrder.update({
                where: { id: rentalOrderId },
                data: {
                    paymentStatus: 'COMPLETED',
                    status: 'PAID'
                }
            });

            return newPayment;
        });
    }

    return {
        paymentStatus: session.payment_status,
        payment: payment
    };
}

const getPaymentHistory = async (userId: string) => {
    const payments = await prisma.payment.findMany({
        where: {
            rentalOrder: {
                customerId: userId
            }
        },
        include: {
            rentalOrder: {
                include: {
                    gearItem: true // optionally include gear item details for better frontend display
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    
    return payments;
}

const getPaymentDetails = async (paymentId: string) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id: paymentId
        },
        include: {
            rentalOrder: {
                include: {
                    gearItem: true,
                    customer: true
                }
            }
        }
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    return payment;
}

export const paymentServices = {
    createCheckoutSession,
    confirmPayment,
    getPaymentHistory,
    getPaymentDetails
}
