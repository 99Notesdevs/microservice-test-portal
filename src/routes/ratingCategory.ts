import { RatingCategoryController } from "../controllers/RatingCategory";
import { Router } from "express";

const ratingCategoryRouter = Router();

ratingCategoryRouter.get("/user/:userId", RatingCategoryController.getRatingCategoryByUserId);
ratingCategoryRouter.get("/category/:categoryId", RatingCategoryController.getRatingCategoryByCategoryId);
ratingCategoryRouter.get("/:userId/:categoryId", RatingCategoryController.getRating);
ratingCategoryRouter.put("/:userId/:categoryId", RatingCategoryController.updateRatingCategory);
ratingCategoryRouter.delete("/:userId/:categoryId", RatingCategoryController.deleteRatingCategory);

export default ratingCategoryRouter;