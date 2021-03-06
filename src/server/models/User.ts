import jwt from "jsonwebtoken";
import { model, Schema } from "mongoose";
import { UserDocument, UserModel } from "../types";

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    accessToken: {
      required: true,
      type: String,
    },
    repos: [
      {
        archive_url: String,
        archived: Boolean,
        assignees_url: String,
        blobs_url: String,
        clone_url: String,
        collaborators_url: String,
        comments_url: String,
        commits_url: String,
        compare_url: String,
        contents_url: String,
        contributors_url: String,
        created_at: String || null,
        default_branch: String,
        deployments_url: String,
        description: String || null,
        disabled: Boolean,
        downloads_url: String,
        events_url: String,
        fork: Boolean,
        forks: Number,
        forks_count: Number,
        forks_url: String,
        full_name: String,
        git_commits_url: String,
        git_refs_url: String,
        git_tags_url: String,
        git_url: String,
        has_downloads: Boolean,
        has_issues: Boolean,
        has_pages: Boolean,
        has_projects: Boolean,
        has_wiki: Boolean,
        homepage: String || null,
        hooks_url: String,
        html_url: String,
        id: Number,
        issue_comment_url: String,
        issue_events_url: String,
        issues_url: String,
        keys_url: String,
        labels_url: String,
        language: String || null,
        languages_url: String,
        license: Object || null,
        merges_url: String,
        milestones_url: String,
        mirror_url: String || null,
        name: String,
        node_id: String,
        notifications_url: String,
        open_issues: Number,
        open_issues_count: Number,
        owner: Object,
        permissions: Object,
        private: Boolean,
        pulls_url: String,
        pushed_at: String,
        releases_url: String,
        size: Number,
        ssh_url: String,
        stargazers_count: Number,
        stargazers_url: String,
        statuses_url: String,
        subscribers_url: String,
        subscription_url: String,
        svn_url: String,
        tags_url: String,
        teams_url: String,
        trees_url: String,
        updated_at: String,
        url: String,
        watchers: Number,
        watchers_count: Number,
      },
    ],
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
