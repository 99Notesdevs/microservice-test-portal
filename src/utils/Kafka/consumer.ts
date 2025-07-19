import logger from '../logger'
import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
  clientId: 'my-test-portal',
  brokers: ['kafka:9092'],
})

export const createConsumer = async (groupId: string, topic: string, handler: (msg: any) => Promise<void>) => {
  const consumer = kafka.consumer({ groupId })

  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: false })

  logger.info(`Consumer connected to topic ${topic} with group ID ${groupId}`)

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logger.info(`Received message from topic ${topic}: ${message.value?.toString()} on partition ${partition}`)
      const decoded = message.value?.toString()
      if (decoded) {
        await handler(JSON.parse(decoded))
      }
    },
  })
}