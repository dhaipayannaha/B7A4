import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import config from "../../config"

const createCheckoutSession = async (userId: string, rentalOrderId: string) => {
    // Fetch the order, verify it belongs to this user, and include the gear item name
    const order = await prisma.rentalOrder.findFirst({
        where: {
            id: rentalOrderId,
            customerId: userId,
        },
        include: {
            gearItem: true,
        },
    });

    if (!order) {
        throw new Error("Order not found or you are not authorized to pay for it");
    }

    if (order.paymentStatus === "COMPLETED") {
        throw new Error("This order has already been paid");
    }

    if (!order.totalAmount || order.totalAmount <= 0) {
        throw new Error("Order has an invalid total amount");
    }

    const session = await stripe.checkout.sessions.create({
        // Omitting payment_method_types to enable Stripe dynamic payment methods
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'bdt',
                    product_data: {
                        name: order.gearItem.title,
                    },
                    // totalAmount is stored in base currency units; Stripe expects smallest units (e.g. paisa/cents)
                    unit_amount: Math.round(order.totalAmount * 100),
                },
                quantity: 1,
            },
        ],
        metadata: {
            rentalOrderId: order.id,
        },
        success_url: `${config.app_url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app_url}/cancel`,
        client_reference_id: userId,
    });

    return session;
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
