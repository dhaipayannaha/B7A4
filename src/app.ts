import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, request, Request, Response } from "express";
import config from "./config";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { providerRoutes } from "./modules/gear/gear.route";
import { categoryRoutes } from "./modules/category/category.route";


const app: Application = express();

app.use(cors({
    origin: config.app_url,
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

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api", providerRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api", rentalRoutes);

app.use("/api/provider", orderRoutes)


app.use(globalErrorHandelar);

export default app;
