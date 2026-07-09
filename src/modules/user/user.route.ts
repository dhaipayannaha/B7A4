import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleweares/auth";
import { Role, UserRole } from "../../../generated/prisma/enums";


const router = Router();

router.post("/user/register", UserController.registerUser);

router.get("/user/me",
    auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
    UserController.getMyProfile);

router.get("/admin/users", auth(Role.ADMIN), UserController.getUsers);

router.patch('/admin/users/:id', auth(Role.ADMIN), UserController.updateUser);

export const userRoutes = router;
