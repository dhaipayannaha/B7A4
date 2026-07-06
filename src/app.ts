import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, request, Request, Response } from "express";
import config from "./config";
import { userRoutes } from "./modules/user/user.route";


const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}));

const endpointSecret = config.stripe_webhook_secret;

// app.post("/api/subscription/webhook", express.raw({ type: 'application/json' }), (req: Request, res: Response) => {
//     let event = req.body;
//     console.log(event, "stripe request body");
//     console.log(req.headers, "stripe request headers");
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//         // Get the signature sent by Stripe
//         const signature = req.headers['stripe-signature']!;
//         try {
//             event = stripe.webhooks.constructEvent(
//                 request.body,
//                 signature,
//                 endpointSecret
//             );
//         } catch (err: any) {
//             console.log(`⚠️  Webhook signature verification failed.`, err.message);
//             return res.status(400).json({
//                 message: err.message
//             });
//         }
//     }

//     console.log(event, "event after try block")
//     // Handle the event
//     switch (event.type) {
//         case 'payment_intent.succeeded':
//             const paymentIntent = event.data.object;
//             console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//             // Then define and call a method to handle the successful payment intent.
//             // handlePaymentIntentSucceeded(paymentIntent);
//             break;
//         case 'payment_method.attached':
//             const paymentMethod = event.data.object;
//             // Then define and call a method to handle the successful attachment of a PaymentMethod.
//             // handlePaymentMethodAttached(paymentMethod);
//             break;
//         default:
//             // Unexpected event type
//             console.log(`Unhandled event type ${event.type}.`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     res.send();
// })

app.use("/api/subscription/webhook", express.raw({ type: 'application/json' }))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Worldddddddd!');
});

app.use("/api/user", userRoutes);

export default app;
