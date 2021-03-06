import jwt from "jsonwebtoken";
import { model, Schema } from "mongoose";
import { UserDocument, UserModel } from "../types";

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    accessToken: {
      required: true,
      type: String,
    },
    tokens: [
      {
        token: {
          required: true,
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function (this: UserDocument) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  const userObject = user.toObject();

  return userObject;
};

UserSchema.methods.generateAuthToken = async function (this: UserDocument) {
  if (!process.env.JWT_SECRET) {
    throw new Error("No JWT_SECRET!");
  }
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat([{ token }]);

  await user.save();

  return token;
};

export default model<UserDocument, UserModel>("User", UserSchema);
