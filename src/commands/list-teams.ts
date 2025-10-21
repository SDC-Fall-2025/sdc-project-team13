import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { prisma } from "../utils/database.js";

export const data = new SlashCommandBuilder()
  .setName("list-teams")
  .setDescription("List all registered teams in the server");

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ ephemeral: true, content: "This command can only be used in a server." });
    return;
  }

  try {
    // Get all teams in the guild
    const teams = await prisma.team.findMany({
      where: { guildId: interaction.guild.id },
      include: {
        members: {
          include: {
            user: true
          }
        }
      },
      orderBy: { teamNumber: 'asc' }
    });

    if (teams.length === 0) {
      await interaction.reply({ 
        ephemeral: true, 
        content: "No teams are registered in this server yet." 
      });
      return;
    }

    // Create embed for team list
    const embed = new EmbedBuilder()
      .setTitle("Registered Teams")
      .setColor(0x5865F2)
      .setTimestamp();

    let teamsText = "";
    teams.forEach((team: any) => {
      const leaders = team.members.filter((member: any) => member.role === "LEADER");
      const memberCount = team.members.length;
      
      teamsText += `**Team ${team.teamNumber}: ${team.name}**\n`;
      teamsText += `• Channel: <#${team.channelId}>\n`;
      teamsText += `• Members: ${memberCount}\n`;
      
      if (leaders.length > 0) {
        const leaderNames = leaders.map((leader: any) => `<@${leader.user.discordId}>`).join(", ");
        teamsText += `• Leader(s): ${leaderNames}\n`;
      }
      
      if (team.projectTitle) {
        teamsText += `• Project: ${team.projectTitle}\n`;
      }
      
      teamsText += "\n";
    });

    // Split into chunks if too long
    if (teamsText.length > 4096) {
      const chunks = teamsText.match(/.{1,4096}/g) || [];
      if (chunks.length > 0) {
        embed.setDescription(chunks[0] || "");
        
        await interaction.reply({ embeds: [embed] });
        
        // Send additional embeds for remaining chunks
        for (let i = 1; i < chunks.length; i++) {
          const additionalEmbed = new EmbedBuilder()
            .setDescription(chunks[i])
            .setColor(0x5865F2);
          await interaction.followUp({ embeds: [additionalEmbed] });
        }
      }
    } else {
      embed.setDescription(teamsText);
      await interaction.reply({ embeds: [embed] });
    }

  } catch (error) {
    console.error("Error listing teams:", error);
    await interaction.reply({ 
      ephemeral: true, 
      content: "An error occurred while listing teams. Please try again." 
    });
  }
}
