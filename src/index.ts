import "dotenv/config";
import express from "express";
import { Client, GatewayIntentBits, Events, Interaction, Message } from "discord.js";
import { execute as helloExec } from "./commands/hello.js";
import { execute as registerTeamExec } from "./commands/register-team.js";
import { execute as addMemberExec } from "./commands/add-member.js";
import { execute as removeMemberExec } from "./commands/remove-member.js";
import { execute as setProjectExec } from "./commands/set-project.js";
import { execute as teamInfoExec } from "./commands/team-info.js";
import { execute as listTeamsExec } from "./commands/list-teams.js";
import { findOrCreateUser, logMessage } from "./utils/database.js";

const PREFIX = "!";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const handlers: Record<string, (i: any) => Promise<any>> = {
  hello: helloExec,
  "register-team": registerTeamExec,
  "add-member": addMemberExec,
  "remove-member": removeMemberExec,
  "set-project": setProjectExec,
  "team-info": teamInfoExec,
  "list-teams": listTeamsExec
};

client.once(Events.ClientReady, c => {
  console.log(`Bot ready as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const fn = handlers[interaction.commandName];
  if (!fn) {
    await interaction.reply({ ephemeral: true, content: "Unknown command" });
    return;
  }
  try {
    await fn(interaction);
  } catch (e) {
    console.error(e);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("Error. Check logs.");
    } else {
      await interaction.reply({ ephemeral: true, content: "Error. Check logs." });
    }
  }
});

// Message logging and prefix commands
client.on(Events.MessageCreate, async (msg: Message) => {
  if (msg.author.bot) return;
  
  // Log all messages for context tracking (Week 2 requirement)
  try {
    const user = await findOrCreateUser(
      msg.author.id,
      msg.author.username,
      msg.author.displayName || undefined
    );
    
    await logMessage(
      msg.guild?.id || "",
      msg.channel.id,
      user.id,
      msg.content
    );
  } catch (error) {
    console.error("Error logging message:", error);
  }

  // Prefix fallback for your Week 1 requirement
  if (!msg.content.startsWith(PREFIX)) return;
  const [cmd] = msg.content.slice(PREFIX.length).trim().split(/\s+/);
  if (cmd.toLowerCase() === "hello") {
    await msg.reply("Hello from prefix mode.");
  }
});

// Tiny HTTP server for health and future webhooks
const app = express();
app.get("/health", (_req, res) => res.send("ok"));
app.listen(Number(process.env.PORT ?? 3000), () => {
  console.log(`HTTP listening on ${process.env.PORT ?? 3000}`);
});

client.login(process.env.DISCORD_TOKEN);
