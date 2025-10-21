import { PrismaClient, TeamRole } from "@prisma/client";
import { GuildMember } from "discord.js";
import { ensureTeamLeaderRole, ensureTeamMemberRole, removeTeamMemberRole } from "./roles.js";

const prisma = new PrismaClient();

export { prisma, TeamRole };

// User management functions
export async function findOrCreateUser(discordId: string, username: string, displayName?: string) {
  return await prisma.user.upsert({
    where: { discordId },
    update: { 
      username,
      displayName: displayName || null,
      updatedAt: new Date()
    },
    create: {
      discordId,
      username,
      displayName: displayName || null
    }
  });
}

export async function getUserByDiscordId(discordId: string) {
  return await prisma.user.findUnique({
    where: { discordId },
    include: {
      teamMemberships: {
        include: {
          team: true
        }
      }
    }
  });
}

// Team management functions
export async function createTeam(teamNumber: number, name: string, channelId: string, guildId: string, leaderId: string, leaderMember?: GuildMember) {
  try {
    return await prisma.$transaction(async (tx) => {
      // Create the team
      const team = await tx.team.create({
        data: {
          teamNumber,
          name,
          channelId,
          guildId
        }
      });

      // Add the leader as a team member
      await tx.teamMember.create({
        data: {
          userId: leaderId,
          teamId: team.id,
          role: TeamRole.LEADER
        }
      });

      // Assign Discord role if member is provided
      if (leaderMember) {
        await ensureTeamLeaderRole(leaderMember, teamNumber);
      }

      return team;
    });
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Database is not available. Please start your PostgreSQL server.");
  }
}

export async function getTeamByChannelId(channelId: string) {
  return await prisma.team.findUnique({
    where: { channelId },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });
}

export async function getTeamByNumber(teamNumber: number) {
  try {
    return await prisma.team.findUnique({
      where: { teamNumber },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return null; // Return null if database is not available
  }
}

export async function addTeamMember(teamId: string, userId: string, role: TeamRole = TeamRole.MEMBER, member?: GuildMember, teamNumber?: number) {
  const teamMember = await prisma.teamMember.create({
    data: {
      teamId,
      userId,
      role
    },
    include: {
      user: true,
      team: true
    }
  });

  // Assign Discord role if member is provided
  if (member && teamNumber) {
    await ensureTeamMemberRole(member, teamNumber);
  }

  return teamMember;
}

export async function removeTeamMember(teamId: string, userId: string, member?: GuildMember, teamNumber?: number) {
  const teamMember = await prisma.teamMember.delete({
    where: {
      userId_teamId: {
        userId,
        teamId
      }
    }
  });

  // Remove Discord role if member is provided
  if (member && teamNumber) {
    await removeTeamMemberRole(member, teamNumber);
  }

  return teamMember;
}

export async function updateTeamProject(teamId: string, projectTitle: string, projectDescription: string) {
  return await prisma.team.update({
    where: { id: teamId },
    data: {
      projectTitle,
      projectDescription,
      updatedAt: new Date()
    }
  });
}

export async function getUserTeamRole(userId: string, teamId: string) {
  const membership = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId
      }
    }
  });
  return membership?.role || null;
}

// Message logging functions
export async function logMessage(guildId: string, channelId: string, authorId: string, content: string) {
  try {
    return await prisma.messageLog.create({
      data: {
        guildId,
        channelId,
        authorId,
        content
      }
    });
  } catch (error) {
    console.error("Database connection error (message logging):", error);
    return null; // Silently fail for message logging
  }
}

export async function getChannelMessageHistory(channelId: string, limit: number = 50) {
  return await prisma.messageLog.findMany({
    where: { channelId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      author: true
    }
  });
}
