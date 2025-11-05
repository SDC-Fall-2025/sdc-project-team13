import { ChatInputCommandInteraction } from "discord.js";

/**
 * /flipcoin — returns either heads or tails.
 */
export const flipCoinCommand = {
  name: "flipcoin",
  description: "Replies with either heads or tails"
};

/** Handles /flipcoin interactions. */
export async function handleFlipCoin(interaction: ChatInputCommandInteraction) {
  const result = Math.random() < 0.5 ? "Heads" : "Tails";
  await interaction.reply(`Result: **${result}**`);
}
