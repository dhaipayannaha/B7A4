import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middleweares/auth";
import { Role } from "@prisma/client"





const router = Router();

router.post('/rentals', auth(), rentalController.createRental);
router.get('/admin/rentals', auth(Role.ADMIN), rentalController.getAllRentals);
router.get('/rentals/:id', auth(), rentalController.getRentalById);

router.get('/rentals', auth(Role.CUSTOMER), rentalController.myRentals);


export const rentalRoutes = router;
