import { GuildMember, Role } from "discord.js";

// Utility functions for Discord role management
export async function ensureTeamLeaderRole(member: GuildMember, teamNumber: number): Promise<Role | null> {
  try {
    const guild = member.guild;
    const roleName = `Team ${teamNumber} Leader`;
    
    // Find existing role
    let role = guild.roles.cache.find(r => r.name === roleName);
    
    // Create role if it doesn't exist
    if (!role) {
      role = await guild.roles.create({
        name: roleName,
        color: 0x5865F2, // Discord blurple
        mentionable: true,
        reason: `Team ${teamNumber} leader role`
      });
    }
    
    // Add role to member if they don't have it
    if (!member.roles.cache.has(role.id)) {
      await member.roles.add(role);
    }
    
    return role;
  } catch (error) {
    console.error("Error managing team leader role:", error);
    return null;
  }
}

export async function removeTeamLeaderRole(member: GuildMember, teamNumber: number): Promise<boolean> {
  try {
    const guild = member.guild;
    const roleName = `Team ${teamNumber} Leader`;
    const role = guild.roles.cache.find(r => r.name === roleName);
    
    if (role && member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error removing team leader role:", error);
    return false;
  }
}

export async function ensureTeamMemberRole(member: GuildMember, teamNumber: number): Promise<Role | null> {
  try {
    const guild = member.guild;
    const roleName = `Team ${teamNumber}`;
    
    // Find existing role
    let role = guild.roles.cache.find(r => r.name === roleName);
    
    // Create role if it doesn't exist
    if (!role) {
      role = await guild.roles.create({
        name: roleName,
        color: 0x00D26A, // Green color for team members
        mentionable: true,
        reason: `Team ${teamNumber} member role`
      });
    }
    
    // Add role to member if they don't have it
    if (!member.roles.cache.has(role.id)) {
      await member.roles.add(role);
    }
    
    return role;
  } catch (error) {
    console.error("Error managing team member role:", error);
    return null;
  }
}

export async function removeTeamMemberRole(member: GuildMember, teamNumber: number): Promise<boolean> {
  try {
    const guild = member.guild;
    const roleName = `Team ${teamNumber}`;
    const role = guild.roles.cache.find(r => r.name === roleName);
    
    if (role && member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error removing team member role:", error);
    return false;
  }
}
