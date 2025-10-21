import "dotenv/config";
import express from "express";
import { Client, GatewayIntentBits, Events, Interaction, Message } from "discord.js";
import { execute as helloExec } from "./commands/hello.js";

const PREFIX = "!";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const handlers: Record<string, (i: any) => Promise<any>> = {
  hello: helloExec
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

// Prefix fallback for your Week 1 requirement
client.on(Events.MessageCreate, async (msg: Message) => {
  if (msg.author.bot) return;
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
