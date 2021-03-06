import { Request, Router } from "express";
import { Document, Model } from "mongoose";

export interface ApplicationRequest extends Request {
  user?: Document;
}

export type Controller = {
  router: Router;
};

export interface Token {
  _id?: string;
  // ? Rename to 'value'
  token: string;
}

export interface UserDocument extends Document {
  accessToken: string;
  generateAuthToken: () => Promise<string>;
  tokens: Token[];
}

export interface UserModel extends Model<UserDocument> {
  save: () => Promise<void>;
  id: string;
}
