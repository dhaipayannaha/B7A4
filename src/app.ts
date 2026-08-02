import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, request, Request, Response } from "express";
import config from "./config";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { providerRoutes } from "./modules/gear/gear.route";
import { categoryRoutes } from "./modules/category/category.route";


const app: Application = express();

const allowedOrigins = [
    config.app_url,
    "http://localhost:3000",
    "https://b7a5.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const endpointSecret = config.stripe_webhook_secret;

app.use("/api/subscription/webhook", express.raw({ type: 'application/json' }))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Worldddddddd!');
});

import { globalErrorHandelar } from "./middleweares/globalerrorHandelar";
import { rentalRoutes } from "./modules/rental/rental.route";
import { orderRoutes } from "./modules/orders/orders.router";
import { reviewRoutes } from "./modules/reviews/reviews.routes";
import { paymentRoutes } from "./modules/payment/payment.route";

app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api", providerRoutes);
app.use("/api", categoryRoutes);
app.use("/api", rentalRoutes);

app.use("/api/provider", orderRoutes);
app.use("/api", reviewRoutes);

app.use("/api/payments", paymentRoutes)


app.use(globalErrorHandelar);

export default app;
