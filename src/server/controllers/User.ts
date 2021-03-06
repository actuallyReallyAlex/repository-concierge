import express, { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import UserModel from "../models/User";
import { ApplicationRequest } from "../types";

class UserController {
  public router: Router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post("/users", async (req: Request, res: Response) => {
      try {
        const user = new UserModel({ accessToken: req.body.accessToken });

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
        return res.status(500).send({ error: "Error when Creating a User" });
      }
    });

    this.router.get(
      "/users/me",
      auth,
      async (req: ApplicationRequest, res: Response) => {
        try {
          return res.send(req.user);
        } catch (e) {
          res.status(500).send();
        }
      }
    );
  }
}

export default UserController;
