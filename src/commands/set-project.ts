import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { getTeamByChannelId, updateTeamProject, getUserTeamRole, TeamRole } from "../utils/database.js";

export const data = new SlashCommandBuilder()
  .setName("set-project")
  .setDescription("Set the project title and description for your team")
  .addStringOption(option =>
    option
      .setName("title")
      .setDescription("The title of your project")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("description")
      .setDescription("A detailed description of your project")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ ephemeral: true, content: "This command can only be used in a server." });
    return;
  }

  const projectTitle = interaction.options.getString("title", true);
  const projectDescription = interaction.options.getString("description", true);

  try {
    // Get the team for this channel
    const team = await getTeamByChannelId(interaction.channelId);
    if (!team) {
      await interaction.reply({ 
        ephemeral: true, 
        content: "No team is registered for this channel. Use `/register-team` first." 
      });
      return;
    }

    // Check if the user executing the command is a team leader
    const userRole = await getUserTeamRole(interaction.user.id, team.id);
    if (userRole !== TeamRole.LEADER) {
      await interaction.reply({ 
        ephemeral: true, 
        content: "Only team leaders can set the project details." 
      });
      return;
    }

    // Update the team's project information
    await updateTeamProject(team.id, projectTitle, projectDescription);

    await interaction.reply({
      content: `✅ **Project Details Updated!**\n\n` +
               `**Team:** ${team.name} (Team ${team.teamNumber})\n` +
               `**Project Title:** ${projectTitle}\n` +
               `**Description:** ${projectDescription}\n\n` +
               `Your team is now ready to start working on the project!`,
      ephemeral: false
    });

  } catch (error) {
    console.error("Error setting project details:", error);
    await interaction.reply({ 
      ephemeral: true, 
      content: "An error occurred while setting the project details. Please try again." 
    });
  }
}
