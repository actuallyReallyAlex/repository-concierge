import { Octokit } from "@octokit/rest";
import isToday from "date-fns/isToday";
import express, { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import UserModel from "../models/User";
import { ApplicationRequest, GHPull, UserDocument } from "../types";

class UserController {
  public router: Router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(
      "/users",
      async (req: Request, res: Response<UserDocument | { error: any }>) => {
        try {
          const accessToken = req.body.accessToken;
          const octokit = new Octokit({ auth: accessToken });
          const response = await octokit.repos.listForAuthenticatedUser({
            per_page: 100,
          });
          const repos = response.data;

          const user = new UserModel({
            accessToken,
            repos,
          });

          await user.save();

          // * Generate a token
          const token = await user.generateAuthToken();
          // * Set a Cookie with that token
          const day = 24 * 60 * 60 * 1000;
          res.cookie("repositoryConcierge", token, {
            maxAge: 30 * day,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // * localhost isn't https
            sameSite: true,
          });

          await user.save();

          return res.status(201).send(user);
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .send({ error: "Error when Creating a GHUser" });
        }
      }
    );

    this.router.get(
      "/users/me",
      auth,
      async (req: ApplicationRequest, res: Response) => {
        try {
          const {
            accessToken,
            repos,
            reposProcessedAt,
          } = req.user as UserDocument;

          const shouldProcessRepos =
            !reposProcessedAt || !isToday(new Date(reposProcessedAt));

          if (shouldProcessRepos) {
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

            // * Save the updated user to the databse
            (req.user as UserDocument).set("repos", updatedRepos);
          }

          // * Set the timestamp for reposProcessedAt
          const timestamp = new Date().toString();
          console.log(`Setting reposProcessedAt to: ${timestamp}`);
          (req.user as UserDocument).set("reposProcessedAt", timestamp);
          await (req.user as UserDocument).save();

          // * Respond with the user db object
          return res.send(req.user);
        } catch (error) {
          console.error(error);
          res.status(500).send({
            error:
              "An error has occured on the server. Repository Concierge has been notified.",
          });
        }
      }
    );
  }
}

export default UserController;
