import { getBotClient, logger as botLog } from "./bot";
import { logger } from "./tools/log";

// Start the application.
logger.info("Starting the program...");

// Attempt to connect to the bot system, and close the connection after.
getBotClient().then((client) => {
  botLog.info("Test complete, closing bot client...");
  client.destroy();
  
  logger.info("Exit with code 0.");
  process.exit(0);
}).catch(botLog.error);