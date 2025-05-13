import { createConsumer } from '../consumer'

createConsumer('log-group', 'user-logs', async (msg) => {
  console.log('Logging event:', msg)
  // Save log to DB or analytics system
})
