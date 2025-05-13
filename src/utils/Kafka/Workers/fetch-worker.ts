import { QuestionBankService } from '../../../services/questionBankService';
import logger from '../../logger'
import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
  clientId: 'my-test-portal',
  brokers: ['kafka:9092'],
})

export const createConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'fetch-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'question-fetch', fromBeginning: false })

  logger.info(`Consumer connected to topic ${'question-fetch'} with group ID ${'fetch-group'}`)
  console.log(`Consumer connected to topic ${'question-fetch'} with group ID ${'fetch-group'}`)

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message from topic ${topic}: ${message.value?.toString()} on partition ${partition}`)
      logger.info(`Received message from topic ${topic}: ${message.value?.toString()} on partition ${partition}`)
      
      const { categoryIds, limit, userId } = JSON.parse(message.value?.toString() || '{}');

      logger.info(`Category IDs: ${typeof categoryIds}`);
      logger.info(`Limit: ${typeof limit}`);
      logger.info(`User ID: ${userId}`);
      
      const parsedCategoryIds = categoryIds.toString().split(',').map((id: string) => Number(id));        
      const questions = await QuestionBankService.getPracticeQuestions(parsedCategoryIds, Number(limit));

      // Emit socket event to a userId
      logger.info(`Questinos: ${JSON.stringify(questions)}`);
    },
  })
}

createConsumer();