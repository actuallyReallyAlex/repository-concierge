import express, { Router, Request, Response } from "express";
import nfetch from "node-fetch";

class AuthController {
  public router: Router = express.Router();

  static assetList = [];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get("/auth", async (req: Request, res: Response) => {
      try {
        return res.send({
          url: `https://github.com/login/oauth/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_URI}&scope=repo`,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).send();
      }
    });

    this.router.get("/auth-redirect", async (req: Request, res: Response) => {
      try {
        const { code } = req.query;

        const response = await nfetch(
          `https://github.com/login/oauth/access_token?client_id=${process.env.OAUTH_CLIENT_ID}&client_secret=${process.env.OAUTH_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.OAUTH_REDIRECT_URI}`,
          {
            headers: {
              Accept: "application/json",
            },
            method: "POST",
          }
        );

        if (response.status !== 200) {
          console.error("Error in OAuth flow");
          return res.status(500).send();
        }

        const body = await response.json();

        if (!body.access_token) {
          console.error("No key 'access_token' exists on response body");
          return res.status(500).send();
        }

        return res.redirect(`/auth-final?accessToken=${body.access_token}`);
      } catch (error) {
        console.error(error);
        return res.status(500).send();
      }
    });
  }
}

export default AuthController;
