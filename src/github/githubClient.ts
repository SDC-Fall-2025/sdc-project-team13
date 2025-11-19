import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

// This Octokit instance uses your personal access token
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
