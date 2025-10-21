import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { findOrCreateUser, getTeamByChannelId, addTeamMember, getUserTeamRole, TeamRole } from "../utils/database.js";

export const data = new SlashCommandBuilder()
  .setName("add-member")
  .setDescription("Add a member to your team")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The user to add to the team")
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
    const leader = await findOrCreateUser(
      interaction.user.id,
      interaction.user.username,
      interaction.user.displayName || undefined
    );

    const userRole = await getUserTeamRole(leader.id, team.id);
    if (userRole !== TeamRole.LEADER) {
      await interaction.reply({ 
        ephemeral: true, 
        content: "Only team leaders can add members to the team." 
      });
      return;
    }

    // Check if user is already a member
    const existingMember = team.members.find((member: any) => member.user.discordId === targetUser.id);
    if (existingMember) {
      await interaction.reply({ 
        ephemeral: true, 
        content: `<@${targetUser.id}> is already a member of this team.` 
      });
      return;
    }

    // Create or find the target user
    const userToAdd = await findOrCreateUser(
      targetUser.id,
      targetUser.username,
      targetUser.displayName || undefined
    );

    // Add the member to the team
    await addTeamMember(team.id, userToAdd.id, TeamRole.MEMBER, interaction.guild.members.cache.get(targetUser.id), team.teamNumber);

    await interaction.reply({
      content: `✅ **Member Added!**\n\n` +
               `<@${targetUser.id}> has been added to **${team.name}** (Team ${team.teamNumber}).`,
      ephemeral: false
    });

  } catch (error) {
    console.error("Error adding team member:", error);
    await interaction.reply({ 
      ephemeral: true, 
      content: "An error occurred while adding the member. Please try again." 
    });
  }
}
