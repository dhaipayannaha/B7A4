import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleweares/auth";

const router = Router();

router.post("/create", auth(), paymentController.createCheckoutSession);

router.post("/confirm", auth(), paymentController.confirmPayment);

router.get("/payments", auth(), paymentController.getPaymentHistory);

router.get("/payments/:id", auth(), paymentController.getPaymentDetails);

export const paymentRoutes = router;