import { CategoryRepository } from "../repositories/categoriesRepository";
import { RatingCategoryRepository } from "../repositories/ratingCategoryRepository";

async function getLeafCategories(categoryId: number) {
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

    return leaves;
}

function calculateElo(currentRating: number, questionRating: number, score: number) {
    const Ps = 1.0 / (1 + Math.pow(10, (currentRating - questionRating) / 400));
    return (currentRating + 8 * (score - Ps));
}

async function updateElo(userId: number, categoryId: number, correct: number, questionRating: number) {
    // Find existing user rating for the category
    const existing = await RatingCategoryRepository.getRating(userId, categoryId);
  
    const currentRating = existing?.rating ?? 250;
    // Find the question rating and then calculate elo
    const score = correct === 1 ? 1 : correct === 0 ? 0 : 0.1; // 1 for correct, 0 for unattempted, 0.1 for incorrect
    const newRating = calculateElo(currentRating, questionRating, score);
  
    await RatingCategoryRepository.updateRatingCategory(userId, categoryId, newRating);
    return newRating;
}

async function propagateRatingUpwards(categoryId: number, userId: number) {
    let currentId = categoryId;

    while (true) {
        // Find the parent of the current category
        const parent = await CategoryRepository.getParentCategory(currentId);

        if (!parent) break;

        const childrenRatings = await Promise.all(parent.daughterTag.map(async (c) => (await RatingCategoryRepository.getRating(userId, c.id))?.rating || 250));;
        const avgRating = childrenRatings.reduce((a, b) => a + b, 0) / childrenRatings.length;

        await RatingCategoryRepository.updateRatingCategory(userId, parent.id, avgRating);

        currentId = parent.id;
    }
}

export async function attemptQuestionService(userId: number, categoryId: number, isCorrect: number, questionRating: number) {
    const targetCategories = await getLeafCategories(categoryId);
    for(const leaf of targetCategories) {
        updateElo(userId, leaf.id, isCorrect, questionRating);
    }
    for(const leaf of targetCategories) {
        propagateRatingUpwards(leaf.id, userId);
    }
}