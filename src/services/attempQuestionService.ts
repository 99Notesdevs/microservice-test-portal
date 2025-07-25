import { CategoryRepository } from "../repositories/categoriesRepository";
import { RatingCategoryRepository } from "../repositories/ratingCategoryRepository";
import logger from "../utils/logger";

async function getLeafCategories(categoryId: number) {
    logger.info("getLeafCategories called with categoryId:", categoryId);
    // Find all the children of the given category
    const queue = [await CategoryRepository.getCategoryById(categoryId)];
    const leaves = [];

    while (queue.length > 0) {
        const node = queue.shift();
        if (!node) continue;

        // Find if the node is a parent to a category / it has children
        const children = await CategoryRepository.getCategoryByParentId(node.id);

        if (children.length === 0) {
        leaves.push(node);
        } else {
        queue.push(...children);
        }
    }

    logger.info("Leaf categories found:", leaves.map(l => l.id));
    return leaves;
}

function calculateElo(currentRating: number, questionRating: number, score: number) {
    logger.info("calculateElo called with", { currentRating, questionRating, score });
    const Ps = 1.0 / (1 + Math.pow(10, (currentRating - questionRating) / 400));
    const result = (currentRating + 8 * (score - Ps));
    return result;
}

async function updateElo(userId: number, categoryId: number, correct: number, questionRating: number) {
    logger.info("updateElo called with", { userId, categoryId, correct, questionRating });
    // Find existing user rating for the category
    const existing = await RatingCategoryRepository.getRating(userId, categoryId);

    const currentRating = existing?.rating ?? 250;
    // Find the question rating and then calculate elo
    const score = correct === 1 ? 1 : correct === -1 ? 0 : 0.1; // 1 for correct, 0 for incorrect, 0.1 for unattempted
    const newRating = calculateElo(currentRating, questionRating, score);

    await RatingCategoryRepository.updateRatingCategory(userId, categoryId, newRating);
    return newRating;
}

async function propagateRatingUpwards(categoryId: number, userId: number) {
    logger.info("propagateRatingUpwards called with", { categoryId, userId });
    let currentId = categoryId;

    while (true) {
        // Find the parent of the current category
        const parent = await CategoryRepository.getParentCategory(currentId);

        if (!parent) break;

        const childrenRatings = await Promise.all(parent.daughterTag.map(async (c) => (await RatingCategoryRepository.getRating(userId, c.id))?.rating || 250));
        const avgRating = childrenRatings.reduce((a, b) => a + b, 0) / childrenRatings.length;

        await RatingCategoryRepository.updateRatingCategory(userId, parent.id, avgRating);

        currentId = parent.id;
    }
    return currentId;
}

async function getWeightedRating(userId: number, categoryId: number) {
    logger.info("getWeightedRating called with", { userId, categoryId });
    const daughterCategories = await CategoryRepository.getCategoryByParentId(categoryId) || [];

    const ratings = await Promise.all(daughterCategories.map(async (c) => (await RatingCategoryRepository.getRating(userId, c.id)) || {id: c.id, rating: 250}));
    let total = (await RatingCategoryRepository.getRating(userId, categoryId))?.rating || 250;
    for (const rating of ratings) {
        const categoryWeight = await CategoryRepository.getCategoryById(rating.id);
        total += Number(categoryWeight?.weight || 0.2) * Number(rating.rating);
    }
    return Math.round(total);
}

export async function attemptQuestionService(userId: number, categoryId: number, isCorrect: number, questionRating: number) {
    logger.info("attemptQuestionService called with", { userId, categoryId, isCorrect, questionRating });
    const targetCategories = await getLeafCategories(categoryId);

    let parent = 0;
    for(const leaf of targetCategories) {
        updateElo(userId, leaf.id, isCorrect, questionRating);
    }
    for(const leaf of targetCategories) {
        parent = await propagateRatingUpwards(leaf.id, userId);
    }
    const globalRating = await getWeightedRating(userId, parent);
    return globalRating;
}