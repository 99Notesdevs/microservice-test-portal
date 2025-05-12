import { app } from './app';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const port = Number(process.env.PORT ) || 5500;

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
  logger.info(`Server running on port ${port}`);
});