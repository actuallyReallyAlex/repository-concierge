import { Octokit } from "@octokit/rest";
import isToday from "date-fns/isToday";
import express, { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import UserModel from "../models/User";
import processRepos from "../processes/processRepos";
import { ApplicationRequest, UserDocument } from "../types";

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
            repoProcessingInProgress: false,
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
            repoProcessingInProgress,
            reposProcessedAt,
          } = req.user as UserDocument;

          // * If repo processing is in progress, send user document
          if (repoProcessingInProgress) {
            return res.send(req.user);
          }

          const shouldProcessRepos =
            !reposProcessedAt || !isToday(new Date(reposProcessedAt));

          if (shouldProcessRepos) {
            await (req.user as UserDocument).updateOne({
              $set: { repoProcessingInProgress: true },
            });
            processRepos(req.user as UserDocument);
            return res.send(req.user);
          }

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
