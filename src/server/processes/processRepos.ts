import { Octokit } from "@octokit/rest";
import { GHPull, UserDocument } from "../types";

const processRepos = async (user: UserDocument): Promise<void> => {
  try {
    const { accessToken, repos } = user;
    const updatedRepos = [...repos];

    const octokit = new Octokit({ auth: accessToken });
    // * Go through each repository
    for (let i = 0; i < updatedRepos.length; i++) {
      const repo = updatedRepos[i];
      if (!repo.owner) {
        throw new Error("No repo.owner!");
      }
      const pullResponse = await octokit.pulls.list({
        owner: repo.owner?.login,
        repo: repo.name,
      });
      // * List of PRs for this particular repo
      const pull: GHPull[] = pullResponse.data;

      // * Update the pullRequests key on the repo object
      console.log(`Repo: ${repo.name} has ${pull.length} open PRs`);
      repo.pullRequests = pull;
    }

    // * Set the timestamp for reposProcessedAt
    const timestamp = new Date().toString();
    console.log(`Setting reposProcessedAt to: ${timestamp}`);
    await user.updateOne({
      $set: {
        repoProcessingInProgress: false,
        repos: updatedRepos,
        reposProcessedAt: timestamp,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export default processRepos;
