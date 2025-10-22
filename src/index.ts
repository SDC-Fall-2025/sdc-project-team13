import { getBotClient, logger } from "./bot";

// Attempt to connect to the bot system, and close the connection after.
getBotClient().then((client) => {
  logger.info("Test complete, closing bot client...");
  client.destroy();
}).catch(logger.error);