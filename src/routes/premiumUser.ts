import { Router } from "express";
import { PremiumUserController } from "../controllers/PremiumUser";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const premiumUserRouter = Router();

premiumUserRouter.get("/tests", authenticate, authorizeRoles(["User"]), PremiumUserController.getUserTests);

premiumUserRouter.get("/testSeries", authenticate, authorizeRoles(["User"]), PremiumUserController.getUserTestSeries);

premiumUserRouter.get("/tests/:id", authenticate, authorizeRoles(["User"]), PremiumUserController.getUserTest);

premiumUserRouter.get("/testSeries/data", authenticate, authorizeRoles(["User"]), PremiumUserController.getLast5TestSeriesData);

premiumUserRouter.get("/testSeries/:id", authenticate, authorizeRoles(["User"]), PremiumUserController.getOneUserTestSeries);

premiumUserRouter.post("/tests", authenticate, authorizeRoles(["User"]), PremiumUserController.storeUserTest);

premiumUserRouter.post("/testSeries", authenticate, authorizeRoles(["User"]), PremiumUserController.storeUserTestSeries);

premiumUserRouter.put("/tests/:id", authenticate, authorizeRoles(["User"]), PremiumUserController.updateUserTest);

premiumUserRouter.put("/testSeries/:id", authenticate, authorizeRoles(["User"]), PremiumUserController.updateUserTestSeries);

export default premiumUserRouter;