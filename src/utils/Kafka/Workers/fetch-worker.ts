import { QuestionBankService } from '../../../services/questionBankService';
import logger from '../../logger'
import { Kafka } from 'kafkajs'
import { getSocketInstance } from '../../../config/socketInstance'; 

export const kafka = new Kafka({
  clientId: 'my-test-portal',
  brokers: ['kafka:9092'],
})

export const createFetchConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'fetch-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'question-fetch', fromBeginning: false })

  logger.info(`Consumer connected to topic ${'question-fetch'} with group ID ${'fetch-group'}`)
  // console.log(`Consumer connected to topic ${'question-fetch'} with group ID ${'fetch-group'}`)

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // console.log(`Received message from topic ${topic}: ${message.value?.toString()} on partition ${partition}`)
      logger.info(`Received message from topic ${topic}: ${message.value?.toString()} on partition ${partition}`)
      
      const { categoryS, limitS, categoryM, limitM, userId } = JSON.parse(message.value?.toString() || '{}');
      
      const parsedCategoryIdsS = categoryS.toString().split(',').map((id: string) => Number(id));        
      const questionsS = await QuestionBankService.getTestQuestions(parsedCategoryIdsS, Number(limitS), 0);

      const parsedCategoryIdsM = categoryM.toString().split(',').map((id: string) => Number(id));
      const questionsM = await QuestionBankService.getTestQuestions(parsedCategoryIdsM, Number(limitM), 1);

      const questions = [...questionsS, ...questionsM];

      // Emit socket event to a userId
      // logger.info(`Questinos: ${JSON.stringify(questions)}`);
      const io = getSocketInstance();
      if(!io) logger.error("Socket instance is not available");
      else logger.info(`Emitted fetch-questions event to room-${userId}`);
      io.to(`room-${userId}`).emit(`fetch-questions`, {
        questions,
        message: `Fetched ${questions.length} questions`,
        status: 'success',
        userId
      });
    },
  })
}