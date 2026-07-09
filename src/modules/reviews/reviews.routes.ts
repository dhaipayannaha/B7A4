import { Router } from "express";
import { reviewController } from "./reviews.controller";
import { auth } from "../../middleweares/auth";

const router = Router();

// POST /api/reviews  — Create a review (only after rental is RETURNED)
router.post("/reviews", auth(), reviewController.createReview);

export const reviewRoutes = router;