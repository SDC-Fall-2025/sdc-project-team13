import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { getTeamByChannelId, removeTeamMember, getUserTeamRole, TeamRole } from "../utils/database.js";

export const data = new SlashCommandBuilder()
  .setName("remove-member")
  .setDescription("Remove a member from your team")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The user to remove from the team")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ ephemeral: true, content: "This command can only be used in a server." });
    return;
  }

  const targetUser = interaction.options.getUser("user", true);

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
    const leader = await getUserTeamRole(interaction.user.id, team.id);
    if (leader !== TeamRole.LEADER) {
      await interaction.reply({ 
        ephemeral: true, 
        content: "Only team leaders can remove members from the team." 
      });
      return;
    }

    // Check if user is a member
    const existingMember = team.members.find((member: any) => member.user.discordId === targetUser.id);
    if (!existingMember) {
      await interaction.reply({ 
        ephemeral: true, 
        content: `<@${targetUser.id}> is not a member of this team.` 
      });
      return;
    }

    // Don't allow removing the team leader
    if (existingMember.role === TeamRole.LEADER) {
      await interaction.reply({ 
        ephemeral: true, 
        content: "You cannot remove the team leader from the team." 
      });
      return;
    }

    // Remove the member from the team
    await removeTeamMember(team.id, existingMember.userId, interaction.guild.members.cache.get(targetUser.id), team.teamNumber);

    await interaction.reply({
      content: `✅ **Member Removed**\n\n` +
               `<@${targetUser.id}> has been removed from **${team.name}** (Team ${team.teamNumber}).`,
      ephemeral: false
    });

  } catch (error) {
    console.error("Error removing team member:", error);
    await interaction.reply({ 
      ephemeral: true, 
      content: "An error occurred while removing the member. Please try again." 
    });
  }
}
