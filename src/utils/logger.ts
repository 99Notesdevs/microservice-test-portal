import pino from "pino";
import PinoLoki from "pino-loki";

// Loki transport setup
const transport = PinoLoki({
  host: "http://loki:3100",
  labels: { app: "test-microservice" },
});


const logger = pino(
  {
    level: "info",
    formatters: {
      level(label) {
        return { level: label };
      }
    },
  },
  transport
);

export default logger;
