import { QuestionBankService } from '../../../services/questionBankService';
import logger from '../../logger'
import { Kafka } from 'kafkajs'
import { getSocketInstance } from '../../../config/socketInstance'; 
import { sendMessage } from '../producer';

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
      
      const { submissions, markingScheme, userId } = JSON.parse(message.value?.toString() || '{}');

      /*
        Example of data recieived from client:

        {
          "submissions": [
            {
              "questionId": 1,
              "selectedOption": "1, 2"
            },
            {
              "questionId": 2,
              "selectedOption": "2, 3"
            },
            {
              "questionId": 3,
              "selectedOption": "1"
            }
          ],
          "markingScheme": {
            "correct": 4,
            "incorrect": -1,
            "unattempted": 0,
            "partial": 2,
            "partialWrong": -2,
            "partialUnattempted": -1
          },
          userId: 1
        }

      */ 

      const result: Record<string, object> = {};
      let score = 0;

      for (const sub of submissions) {
        const { questionId, selectedOption } = sub;
        const question = await QuestionBankService.getQuestionById(Number(questionId));
        if (question) {
          const isMultipleChoice = question.multipleCorrectType ? 1 : 0; // 0 for single choice, 1 for multiple choice
          switch (isMultipleChoice) {
            case 0:
              if(selectedOption === 'unattempted') {
                result[questionId] = {...question, isCorrect: false};
                score += markingScheme.unattempted;
              }
              else if (question.answer === selectedOption) {
                result[questionId] = {...question, isCorrect: true};
                score += markingScheme.correct;
              } else {
                result[questionId] = {...question, isCorrect: false};
                score += markingScheme.incorrect;
              }
              break;
            case 1:
              const selectedOptions = selectedOption.split(',');
              const correctOptions = question.answer.split(',');

              const allCorrect = correctOptions.every(option => selectedOptions.includes(option));
              // @ts-ignore
              const hasIncorrectOption = selectedOptions.some(option => !correctOptions.includes(option));

              // First check unattempter, then check check for wrong options, then for all correct and partially correct
              // Check the T F status on the frontend
              if (selectedOptions.length === 0) {
                score += markingScheme.partialUnattempted;
                result[questionId] = { ...question, isCorrect: true, isPartiallyCorrect: false}; // T F -- Unattempted
              } else if (hasIncorrectOption) {
                score += markingScheme.partialWrong;
                result[questionId] = { ...question, isCorrect: false, isPartiallyCorrect: false}; // F F -- Incorrect
              } else if (allCorrect) {
                score += markingScheme.partial * correctOptions.length;
                result[questionId] = { ...question, isCorrect: true, isPartiallyCorrect: true}; // T T -- Correct
              } else {
                // @ts-ignore
                const correctSelectedCount = selectedOptions.filter(option => correctOptions.includes(option)).length;
                score += markingScheme.partial * correctSelectedCount;
                result[questionId] = { ...question, isCorrect: false, isPartiallyCorrect: true}; // F T -- Partially Correct
              }
              break;
            default:
              logger.error(`Invalid multiple choice type for question ID ${questionId}`);
              break;
          }
        }
      }

      // Emit socket event to a userId
      const io = getSocketInstance();
      if(!io) logger.error("Socket instance is not available");
      else logger.info(`Emitted fetch-questions event to room-${userId}`);
      io.to(`room-${userId}`).emit(`submit-questions`, {
        result,
        score,
        status: 'success',
        userId
      });
      await sendMessage('user-rating', {
        userId, 
        result
      })
    },
  })
}