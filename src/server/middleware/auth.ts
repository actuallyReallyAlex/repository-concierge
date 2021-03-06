import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";
import { ApplicationRequest, Token } from "../types";

const auth = async (
  req: ApplicationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("No JWT_SECRET!");
    }
    const tokenFromCookie: string = req.cookies.repositoryConcierge;
    // *Check if Cookie exists
    if (tokenFromCookie) {
      // *Verify the jwt value
      const decoded = jwt.verify(tokenFromCookie, process.env.JWT_SECRET);
      const user = await UserModel.findOne({
        _id: (decoded as Token)._id,
        "tokens.token": tokenFromCookie,
      });
      if (!user) {
        throw new Error(
          `No user found in database. { _id: ${
            (decoded as Token)._id
          }, tokens.token: ${tokenFromCookie}, path: ${req.originalUrl} }`
        );
      }

      // * User is authenticated
      req.user = user;
      next();
    } else {
      res.status(401).send({ error: "Please authenticate." });
    }
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "An error has occured." });
  }
};

export default auth;
