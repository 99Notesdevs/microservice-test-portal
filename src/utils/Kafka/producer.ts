import logger from "../logger";
import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
  clientId: 'my-test-portal',
  brokers: ['kafka:9092'],
})
const producer = kafka.producer()

export const sendMessage = async (topic: string, message: any) => {
  await producer.connect();
  console.log(`Sending message to topic ${topic}: ${JSON.stringify(message)}`)
  logger.info(`Sending message to topic ${topic}: ${JSON.stringify(message)}`)
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  })
  await producer.disconnect()
}
