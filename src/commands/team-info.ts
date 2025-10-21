import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getTeamByChannelId } from "../utils/database.js";

export const data = new SlashCommandBuilder()
  .setName("team-info")
  .setDescription("View information about your team");

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ ephemeral: true, content: "This command can only be used in a server." });
    return;
  }

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

    // Create embed for team information
    const embed = new EmbedBuilder()
      .setTitle(`Team ${team.teamNumber}: ${team.name}`)
      .setColor(0x5865F2)
      .setTimestamp();

    if (team.projectTitle) {
      embed.addFields(
        { name: "Project Title", value: team.projectTitle, inline: false },
        { name: "Project Description", value: team.projectDescription || "No description set", inline: false }
      );
    } else {
      embed.addFields(
        { name: "Project Status", value: "No project details set yet. Use `/set-project` to add them.", inline: false }
      );
    }

    // Add team members
    const leaders = team.members.filter(member => member.role === "LEADER");
    const members = team.members.filter(member => member.role === "MEMBER");

    let membersText = "";
    if (leaders.length > 0) {
      membersText += "**Leaders:**\n";
      leaders.forEach(leader => {
        membersText += `• <@${leader.user.discordId}> (${leader.user.displayName || leader.user.username})\n`;
      });
    }

    if (members.length > 0) {
      membersText += "\n**Members:**\n";
      members.forEach(member => {
        membersText += `• <@${member.user.discordId}> (${member.user.displayName || member.user.username})\n`;
      });
    }

    if (membersText) {
      embed.addFields({ name: "Team Members", value: membersText, inline: false });
    }

    embed.addFields(
      { name: "Channel", value: `<#${team.channelId}>`, inline: true },
      { name: "Created", value: `<t:${Math.floor(team.createdAt.getTime() / 1000)}:R>`, inline: true }
    );

    await interaction.reply({ embeds: [embed] });

  } catch (error) {
    console.error("Error getting team info:", error);
    await interaction.reply({ 
      ephemeral: true, 
      content: "An error occurred while getting team information. Please try again." 
    });
  }
}
