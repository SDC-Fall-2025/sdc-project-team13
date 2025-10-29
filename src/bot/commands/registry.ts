import { helloCommand, handleHello } from "./hello";
import { randomCommand, handleRandom } from "./random";

/**
 * Central registry for slash commands:
 * - commandDefinitions: used by registerCommands.ts to sync with Discord
 * - commandHandlers: used at runtime to route interactions by name
 */
export const commandDefinitions = [helloCommand, randomCommand];
export const commandHandlers = new Map([
    [helloCommand.name, handleHello],
    [randomCommand.name, handleRandom]
]);

