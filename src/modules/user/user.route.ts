import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleweares/auth";
import { UserRole } from "../../../generated/prisma/enums";


const router = Router();

router.post("/register", UserController.registerUser);



export const userRoutes = router;
