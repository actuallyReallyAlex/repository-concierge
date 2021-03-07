import { Octokit } from "@octokit/rest";
import express, { Router, Response } from "express";
import auth from "../middleware/auth";
import {
  AuthenticatedRequest,
  Pull,
  ResponseDataReposPullsGET,
  Repo,
} from "../types";

class ReposController {
  public router: Router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(
      "/repos/pull-requests",
      auth,
      async (
        req: AuthenticatedRequest,
        res: Response<ResponseDataReposPullsGET | { error: any }>
      ) => {
        try {
          const { accessToken, repos } = req.user || {
            accessToken: null,
            repos: [],
          };

          const octokit = new Octokit({ auth: accessToken });
          const reposWithPullRequests: {
            repo: Repo;
            prs: Pull[];
            pr_count: number;
          }[] = [];

          for (let i = 0; i < repos.length; i++) {
            const repo = repos[i];
            if (!repo.owner) {
              throw new Error("No repo.owner!");
            }
            const pullResponse = await octokit.pulls.list({
              owner: repo.owner?.login,
              repo: repo.name,
            });
            const pull: Pull[] = pullResponse.data;
            if (pull.length > 0) {
              reposWithPullRequests.push({
                repo,
                prs: pull,
                pr_count: pull.length,
              });
            }
          }

          return res.send(reposWithPullRequests);
        } catch (error) {
          console.error(error);
          return res.status(500).send({ error });
        }
      }
    );
  }
}

export default ReposController;
