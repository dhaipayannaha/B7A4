import { Router } from "express";
import { providerController } from "./provider.controller";
import { auth } from "../../middleweares/auth";
import { Role } from "../../../generated/prisma/enums";





const router = Router();

router.post("/gear", auth(Role.PROVIDER), providerController.createGear);
router.put("/gear/:id", auth(Role.PROVIDER), providerController.updateGear);


export const providerRoutes = router;

