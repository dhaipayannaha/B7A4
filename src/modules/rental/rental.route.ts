import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middleweares/auth";





const router = Router();

router.post('/rentals', auth(), rentalController.createRental);
router.get('/rentals', auth(), rentalController.getAllRentals);
router.get('/rentals/:id', auth(), rentalController.getRentalById);

export const rentalRoutes = router;