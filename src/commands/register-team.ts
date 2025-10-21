import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { findOrCreateUser, createTeam, getTeamByNumber } from "../utils/database.js";

export const data = new SlashCommandBuilder()
  .setName("register-team")
  .setDescription("Register a new team for project management")
  .addIntegerOption(option =>
    option
      .setName("team-number")
      .setDescription("The team number (1-22)")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(22)
  )
  .addStringOption(option =>
    option
      .setName("team-name")
      .setDescription("The name of your team")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ ephemeral: true, content: "This command can only be used in a server." });
    return;
  }

  const teamNumber = interaction.options.getInteger("team-number", true);
  const teamName = interaction.options.getString("team-name", true);

  try {
    // Check if team number already exists
    const existingTeam = await getTeamByNumber(teamNumber);
    if (existingTeam) {
      await interaction.reply({ 
        ephemeral: true, 
        content: `Team ${teamNumber} is already registered. Please choose a different team number.` 
      });
      return;
    }

    // Create or find the user
    const user = await findOrCreateUser(
      interaction.user.id,
      interaction.user.username,
      interaction.user.displayName || undefined
    );

    // Create the team
    const team = await createTeam(
      teamNumber,
      teamName,
      interaction.channelId,
      interaction.guild.id,
      user.id,
      interaction.member as any
    );

    await interaction.reply({
      content: `✅ **Team ${teamNumber} registered successfully!**\n\n` +
               `**Team Name:** ${teamName}\n` +
               `**Channel:** <#${interaction.channelId}>\n` +
               `**Leader:** <@${interaction.user.id}>\n\n` +
               `You can now use team management commands to add members and set up your project.`,
      ephemeral: false
    });

  } catch (error) {
    console.error("Error registering team:", error);
    await interaction.reply({ 
      ephemeral: true, 
      content: "An error occurred while registering the team. Please try again." 
    });
  }
}
