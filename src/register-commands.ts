import "dotenv/config";
import { REST, Routes } from "discord.js";
import { data as hello } from "./commands/hello.js";
import { data as registerTeam } from "./commands/register-team.js";
import { data as addMember } from "./commands/add-member.js";
import { data as removeMember } from "./commands/remove-member.js";
import { data as setProject } from "./commands/set-project.js";
import { data as teamInfo } from "./commands/team-info.js";
import { data as listTeams } from "./commands/list-teams.js";

const token = process.env.DISCORD_TOKEN as string;
const appId = process.env.DISCORD_APP_ID as string;
const guildId = process.env.DISCORD_GUILD_ID as string;

if (!token || !appId || !guildId) {
  console.error("Missing DISCORD_TOKEN or DISCORD_APP_ID or DISCORD_GUILD_ID in .env");
  process.exit(1);
}

const rest = new REST({ version: "10" }).setToken(token);

async function main() {
  const commands = [
    hello.toJSON(),
    registerTeam.toJSON(),
    addMember.toJSON(),
    removeMember.toJSON(),
    setProject.toJSON(),
    teamInfo.toJSON(),
    listTeams.toJSON()
  ];
  await rest.put(
    Routes.applicationGuildCommands(appId, guildId),
    { body: commands }
  );
  console.log("Slash commands registered to guild", guildId);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
