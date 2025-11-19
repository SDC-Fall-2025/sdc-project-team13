import { octokit } from "./githubClient";

export class GitHubService {
  async getRecentCommits(owner: string, repo: string) {
    const res = await octokit.request("GET /repos/{owner}/{repo}/commits", {
      owner,
      repo,
      per_page: 100
    });
    return res.data;
  }

  async getOpenPullRequests(owner: string, repo: string) {
    const res = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner,
      repo,
      state: "open"
    });
    return res.data;
  }

  async getMilestones(owner: string, repo: string) {
    const res = await octokit.request("GET /repos/{owner}/{repo}/milestones", {
      owner,
      repo
    });
    return res.data;
  }
}
