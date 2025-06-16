import logger from "../../logger";
import { Kafka } from "kafkajs";
import { getSocketInstance } from "../../../config/socketInstance";
import { QuestionBankRepository } from "../../../repositories/questionBankRepository";
import { getUserRating, updateUserRating } from "../../../grpc/client/client";
import { RatingCategoryRepository } from "../../../repositories/ratingCategoryRepository";
import { attemptQuestionService } from "../../../services/attempQuestionService";

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

      let newGlobalRating = 0;
      
      for (const [questionId, questionValue] of Object.entries(result)) {
        const question = questionValue as { isCorrect: boolean; rating: number, categories: {id: string}, selectedOption: string };
        const { isCorrect, categories, selectedOption } = question;
        const categoryId = parseInt(categories.id);

        const markValue = (!isCorrect && selectedOption === 'unattempted') ? 0 : isCorrect ? 1 : -1;
        // Updating question attempts in the database
        const updateQuestionAttempt = await QuestionBankRepository.updateQuestionAttempts(
          parseInt(questionId),
          markValue
        );

        // Do the Elo calculation
        newGlobalRating = await attemptQuestionService(userId, categoryId, markValue, question.rating);
      }

      const io = getSocketInstance();
      if (!io) logger.error("Socket instance is not available");
      else {
        io.to(`room-${userId}`).emit(`user-rating`, {
          userId,
          overallRating: newGlobalRating,
          message: "Rating updated successfully",
        });
      }
    },
  });
}
// Propagate the category id to the leaves and update the user rating on all the leaves, then recusrsively update the user rating on all the parents
// if leaf then update the user rating on the leaf and then update the user rating on the parent