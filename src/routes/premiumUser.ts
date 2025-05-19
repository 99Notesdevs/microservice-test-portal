import { Router } from "express";
import { PremiumUserController } from "../controllers/PremiumUser";

const premiumUserRouter = Router();

premiumUserRouter.get("/tests", PremiumUserController.getUserTests);

premiumUserRouter.get("/testSeries", PremiumUserController.getUserTestSeries);

premiumUserRouter.get("/tests/:id", PremiumUserController.getUserTest);

premiumUserRouter.get("/testSeries/:id", PremiumUserController.getOneUserTestSeries);

premiumUserRouter.post("/tests", PremiumUserController.storeUserTest);

premiumUserRouter.post("/testSeries", PremiumUserController.storeUserTestSeries);

premiumUserRouter.put("/tests/:id", PremiumUserController.updateUserTest);

premiumUserRouter.put("/testSeries/:id", PremiumUserController.updateUserTestSeries);

export default premiumUserRouter;