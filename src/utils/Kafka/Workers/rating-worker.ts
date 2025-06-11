import logger from "../../logger";
import { Kafka } from "kafkajs";
import { getSocketInstance } from "../../../config/socketInstance";
import { QuestionBankRepository } from "../../../repositories/questionBankRepository";
import { getUserRating, updateUserRating } from "../../../grpc/client/client";
import { RatingCategoryRepository } from "../../../repositories/ratingCategoryRepository";
import { CategoryRepository } from "../../../repositories/categoriesRepository";

const kafka = new Kafka({
  clientId: "my-test-portal",
  brokers: ["kafka:9092"],
});

export const createRatingConsumer = async () => {
  const consumer = kafka.consumer({ groupId: "rating-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "user-rating", fromBeginning: false });

  logger.info(
    `Consumer connected to topic ${"user-rating"} with group ID ${"rating-group"}`
  );

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logger.info(
        `Received message from topic ${topic}: ${message.value?.toString()} on partition ${partition}`
      );

      const { userId, result } = JSON.parse(
        message.value?.toString() || "{}"
      );

      const Rp = (await getUserRating(userId)).rating;
      console.log(`Current user rating (Rp): ${Rp}`);
      
      const userRatingCategories = await RatingCategoryRepository.getRatingCategoryByUserId(userId);
      let deltaRp: Record<string, number> = {};
      let weightedSum = 0.0;
      
      for (const [questionId, questionValue] of Object.entries(result)) {
        const question = questionValue as { isCorrect: boolean; rating: number, categories: {id: string}, selectedOption: string };
        const { isCorrect, categories, selectedOption } = question;
        const categoryId = parseInt(categories.id);

        const markValue = (!isCorrect && selectedOption === 'unattempted') ? 0 : isCorrect ? 1 : -1;
        const updateQuestionAttempt = await QuestionBankRepository.updateQuestionAttempts(
          parseInt(questionId),
          markValue
        );
        
        // Get player rating for the category id from the database
        const userRating = userRatingCategories.find(
          (rating) => rating.categoryId === categoryId
        ) || { rating: 250 };
        // evaluate and update the new rating based on ELO -- fetch the ratings first before the loop and then calculate the delta for each category rating for the user, then update all the ratings after the loop
        const Ps = (1.0/(1.0 + Math.pow(10, (userRating.rating - question.rating) / 400)));
        const delta = 8 * ((markValue === 1 ? 1 : markValue === 0 ? 0 : 0.1) - Ps);
        deltaRp[categoryId] = (deltaRp[categoryId] || 250) + delta;
      }
      console.log(`Calculated deltaRp: ${deltaRp}`);

      // Update the user rating based on the calculated delta
      for (const [categoryId, delta] of Object.entries(deltaRp)) {
        const updatedRating = await RatingCategoryRepository.updateRatingCategory(
          userId,
          parseInt(categoryId),
          delta
        );
        const categoryWeightRaw = (await CategoryRepository.getCategoryById(parseInt(categoryId)))?.weight;
        const categoryWeight = typeof categoryWeightRaw === "number" ? categoryWeightRaw : 0.2;
        const deltaNum = typeof delta === "number" ? delta : Number(delta);
        weightedSum += categoryWeight * deltaNum;
        console.log(`Updated rating for category ${categoryId}: ${updatedRating}`);
      }

      // Finally, update the overall user rating by taking weighted average of all category ratings
      const newUserRating = Rp + weightedSum;
      const updated = await updateUserRating(userId, newUserRating);
      console.log(`Updated user rating: ${newUserRating}, status: ${updated}`);

      const io = getSocketInstance();
      if (!io) logger.error("Socket instance is not available");
      else {
        io.to(`room-${userId}`).emit(`user-rating`, {
          status: updated,
          userId,
          rating: deltaRp,
          overallRating: newUserRating,
          message: "Rating updated successfully",
        });
      }
    },
  });
}