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
        success_url: `${config.frontend_url}/payment/success?session_id={CHECKOUT_SESSION_ID}&rentalOrderId=${order.id}`,
        cancel_url: `${config.frontend_url}/payment/cancel`,
        client_reference_id: userId,
    });

    return session;
}

const confirmPayment = async (transactionId: string, rentalOrderId?: string) => {
    // Detect if transactionId is a real Stripe checkout session (they always start with "cs_")
    const isStripeSession = transactionId.startsWith("cs_");

    if (isStripeSession) {
        // ── Stripe flow ─────────────────────────────────────────
        const session = await stripe.checkout.sessions.retrieve(transactionId);

        if (session.payment_status !== 'paid') {
            throw new Error("Payment has not been completed");
        }

        // Use rentalOrderId from param, or fall back to metadata in the session
        const orderId = rentalOrderId || session.metadata?.rentalOrderId;

        if (!orderId) {
            throw new Error("Could not determine rental order ID from session");
        }

        const payment = await prisma.$transaction(async (tx) => {
            // Idempotency check — don't double-create the payment record
            const existingPayment = await tx.payment.findUnique({
                where: { transactionId }
            });

            if (existingPayment) {
                return existingPayment;
            }

            const order = await tx.rentalOrder.findUnique({ where: { id: orderId } });
            if (!order) throw new Error("Rental Order not found");

            const newPayment = await tx.payment.create({
                data: {
                    transactionId,
                    rentalOrderId: orderId,
                    amount: session.amount_total ? session.amount_total / 100 : order.totalAmount,
                    status: 'COMPLETED',
                    paidAt: new Date(),
                }
            });

            await tx.rentalOrder.update({
                where: { id: orderId },
                data: {
                    paymentStatus: 'COMPLETED',
                    status: 'PAID',
                }
            });

            return newPayment;
        });

        return { paymentStatus: 'paid', payment };
    } else {
        // ── Direct / non-Stripe flow ─────────────────────────────
        // transactionId here is actually the rentalOrderId — just mark it as paid directly
        const orderId = rentalOrderId || transactionId;

        const order = await prisma.rentalOrder.findUnique({ where: { id: orderId } });
        if (!order) throw new Error("Rental Order not found");

        if (order.paymentStatus === 'COMPLETED') {
            // Already paid — idempotent
            return { paymentStatus: 'paid', payment: null };
        }

        await prisma.rentalOrder.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'COMPLETED',
                status: 'PAID',
            }
        });

        return { paymentStatus: 'paid', payment: null };
    }
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
