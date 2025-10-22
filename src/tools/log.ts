// Import modules for logger.
import { createLogger, format, transports } from "winston";

/**
 * Creates a new named logger.
 * 
 * @param name The name to attach to this logger.
 * @param level The level this displays by default.
 * @returns A winston logger ready for use.
 */
export function createNewLogger(name: string, level: string) {
  return createLogger({
    level: level,
    format: format.combine(
      format.label({label: name}),
      format.timestamp(), 
      format.printf(({timestamp, label, level, message}) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
      })
    ),
    transports: [new transports.Console()]
  })
}