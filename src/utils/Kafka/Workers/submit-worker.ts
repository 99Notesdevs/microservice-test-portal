import { createConsumer } from '../consumer'

createConsumer('submit-group', 'submission-eval', async (msg) => {
  console.log('Evaluating submission:', msg)
  // Evaluate user code
})
