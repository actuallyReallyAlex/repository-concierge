import express, { Router, Request, Response } from "express";

class GitHubController {
  public router: Router = express.Router();

  static assetList = [];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get("/gh", async (req: Request, res: Response) => {
      try {
        return res.send({
          url: `https://github.com/login/oauth/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_URI}&scope=repo`,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).send();
      }
    });

    this.router.get("/gh-redirect", async (req: Request, res: Response) => {
      try {
        const { code } = req.query;
        console.log({ code });
        return res.status(501).send();
      } catch (error) {
        console.error(error);
        return res.status(500).send();
      }
    });
  }
}

export default GitHubController;
