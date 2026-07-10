import { Router } from "express";
import { OrderController } from "./orders.controllers";
import { auth } from "../../middleweares/auth";
import { Role } from "@prisma/client"





const router = Router();

router.get('/orders', auth(Role.PROVIDER), OrderController.getOrders);

router.get('/orders/:id', auth(Role.PROVIDER), OrderController.getOrderById);

router.patch('/orders/:id', auth(Role.PROVIDER), OrderController.updateOrder);

export const orderRoutes = router;
