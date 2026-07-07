import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleweares/auth";
import { Role, UserRole } from "../../../generated/prisma/enums";


const router = Router();

router.post("/register", UserController.registerUser);

router.get("/me",
    auth(Role.CUSTOMER, Role.PROVIDER),
    UserController.getMyProfile);

export const userRoutes = router;
