import { REST, Routes } from "discord.js";
import { commandDefinitions } from "./commands/registry";
import "dotenv/config"; // automatically loads .env into process.env


async function main() {
    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;

    // Check if all required environment variables are set
    if (!token || !clientId || !guildId) {
        console.error("Missing required discord bot environment variables :(");
        process.exit(1);
    }

    // Create a new REST client
    const rest = new REST({ version: "10" }).setToken(token);

    // Guild Commands for dev environment that propogate instantly
    await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commandDefinitions }
    )

    console.log("Successfully registered guild commands for dev environment :)");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
