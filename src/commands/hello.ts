import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("Say hi");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({ ephemeral: true, content: "Hi. I exist." });
}
