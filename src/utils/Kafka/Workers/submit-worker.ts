import { QuestionBankService } from '../../../services/questionBankService';
import logger from '../../logger'
import { Kafka } from 'kafkajs'
import { getSocketInstance } from '../../../config/socketInstance'; 

export const kafka = new Kafka({
  clientId: 'my-test-portal',
  brokers: ['kafka:9092'],
})

export const createSubmitConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'submit-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'question-submit', fromBeginning: false })

  logger.info(`Consumer connected to topic ${'question-submit'} with group ID ${'submit-group'}`)

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logger.info(`Received message from topic ${topic}: ${message.value?.toString()} on partition ${partition}`)
      
      const { submissions, userId } = JSON.parse(message.value?.toString() || '{}');

      const result: Record<string, object> = {};

      for (const sub of submissions) {
        const { questionId, selectedOption } = sub;
        const question = await QuestionBankService.getQuestionById(Number(questionId));
        if (question) {
          const isCorrect = question.answer === selectedOption;
          result[questionId] = {...question, isCorrect};
        }
      }

      // Emit socket event to a userId
      const io = getSocketInstance();
      if(!io) logger.error("Socket instance is not available");
      else logger.info(`Emitted fetch-questions event to room-${userId}`);
      io.to(`room-${userId}`).emit(`submit-questions`, {
        result,
        status: 'success',
        userId
      });
    },
  })
}