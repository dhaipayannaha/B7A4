import { Router } from "express";
import { providerController } from "./gear.controller";
import { auth } from "../../middleweares/auth";
import { Role } from "../../../generated/prisma/enums";





const router = Router();

router.post("/provider/gear", auth(Role.PROVIDER), providerController.createGear);
router.put("/provider/gear/:id", auth(Role.PROVIDER), providerController.updateGear);

router.delete("/provider/gear/:id", auth(Role.PROVIDER), providerController.deleteGear);

router.get("/gear", providerController.getAllGear)
router.get("/gear/:id", providerController.getSingleGear)

router.get("/admin/gear", auth(Role.ADMIN), providerController.getAllGear);



export const providerRoutes = router;

