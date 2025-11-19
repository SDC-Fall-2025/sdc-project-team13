import { ChatInputCommandInteraction } from "discord.js";
import { GitHubService } from "../../github/githubService"; // <-- correct relative path

const github = new GitHubService();

export const githubStatsCommand = {
  name: "ghstats",
  description: "Shows GitHub stats for a repository",
  options: [
    {
      type: 3, // STRING
      name: "owner",
      description: "GitHub username or organization",
      required: true
    },
    {
      type: 3, // STRING
      name: "repo",
      description: "Repository name",
      required: true
    }
  ]
};

export async function handleGithubStats(interaction: ChatInputCommandInteraction) {
  const owner = interaction.options.getString("owner", true);
  const repo = interaction.options.getString("repo", true);

  try {
    const commits = await github.getRecentCommits(owner, repo);
    const prs = await github.getOpenPullRequests(owner, repo);
    const milestones = await github.getMilestones(owner, repo);

    const message =
      `GitHub Stats for ${owner}/${repo}\n` +
      `Recent commits: ${commits.length}\n` +
      `Open pull requests: ${prs.length}\n` +
      `Milestones: ${milestones.length}`;

    await interaction.reply(message);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "Error: Could not fetch GitHub data. Check owner/repo name.",
      ephemeral: true
    });
  }
}
