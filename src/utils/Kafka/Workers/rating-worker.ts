import logger from "../../logger";
import { Kafka } from "kafkajs";
import { getSocketInstance } from "../../../config/socketInstance";
import { QuestionBankRepository } from "../../../repositories/questionBankRepository";
import { getUserRating, updateUserRating } from "../../../grpc/client/client";

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

      // Update the number of question attempts in the database
      // Calculate new rating of the user based on ELO
      const { userId, result } = JSON.parse(
        message.value?.toString() || "{}"
      );

      const Rp = (await getUserRating(userId)).rating;
      let deltaRp = 0;
      console.log(`Current user rating (Rp): ${Rp}`);
      
      for (const [questionId, questionValue] of Object.entries(result)) {
        const question = questionValue as { isCorrect: boolean; rating: number };
        console.log(`Processing questionId: ${questionId}, isCorrect: ${question.isCorrect}, rating: ${question.rating}`);
        const { isCorrect } = question;
        const updateQuestionAttempt = await QuestionBankRepository.updateQuestionAttempts(
          parseInt(questionId),
          isCorrect
        );
        const Ps = (1.0/(1.0 + Math.pow(10, (Rp - question.rating) / 400)));
        deltaRp += 8 * ((isCorrect ? 1 : 0) - Ps);
      }
      console.log(`Calculated deltaRp: ${deltaRp}`);

      const newUserRating = Rp + deltaRp;
      const updated = await updateUserRating(userId, newUserRating);
      console.log(`Updated user rating: ${newUserRating}, status: ${updated}`);

      const io = getSocketInstance();
      if (!io) logger.error("Socket instance is not available");
      else {
        io.to(`room-${userId}`).emit(`user-rating`, {
          status: updated,
          userId,
          rating: newUserRating,
          message: "Rating updated successfully",
        });
      }
    },
  });
}