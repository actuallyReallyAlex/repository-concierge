import { Request, Router } from "express";
import { Document, Model } from "mongoose";

export interface ApplicationRequest extends Request {
  user?: Document;
}

export interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

interface GHAutoMerge {
  enabled_by: GHUser | null;
}

interface GHBase {
  label: string;
  ref: string;
  repo: GHRepo;
  sha: string;
  user: GHUser | null;
}

export type Controller = {
  router: Router;
};

interface GHLabel {
  id?: number | undefined;
  node_id?: string | undefined;
  url?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  color?: string | undefined;
  default?: boolean | undefined;
}

interface GHLicense {
  key: string;
  name: string;
  url: string | null;
  spdx_id: string | null;
  node_id: string;
  html_url?: string | undefined;
}

interface GHLink {
  href: string;
}

interface GHLinks {
  comments: GHLink;
  commits: GHLink;
  html: GHLink;
  issue: GHLink;
  review_comment: GHLink;
  review_comments: GHLink;
  self: GHLink;
  statuses: GHLink;
}

interface GHMilestone {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  node_id: string;
  number: number;
  state: "open" | "closed";
  title: string;
  description: string | null;
  creator: GHUser | null;
}

interface GHPermissions {
  admin: boolean;
  pull: boolean;
  triage?: boolean | undefined;
  push: boolean;
  maintain?: boolean | undefined;
}

export interface GHPull {
  _links: GHLinks;
  active_lock_reason?: string | null | undefined;
  assignee: GHUser | null;
  assignees?: (GHUser | null)[] | null | undefined;
  auto_merge: GHAutoMerge | null;
  base: GHBase;
  body: string | null;
  closed_at: string | null;
  comments_url: string;
  commits_url: string;
  created_at: string;
  diff_url: string;
  draft?: boolean | undefined;
  head: GHBase;
  html_url: string;
  id: number;
  issue_url: string;
  labels: GHLabel[];
  locked: boolean;
  merge_commit_sha: string | null;
  merged_at: string | null;
  milestone: GHMilestone | null;
  node_id: string;
  number: number;
  patch_url: string;
  requested_reviewers?: (GHUser | null)[] | null | undefined;
  requested_teams?: (GHTeam | null)[] | null | undefined;
  review_comment_url: string;
  review_comments_url: string;
  state: string;
  statuses_url: string;
  title: string;
  updated_at: string;
  url: string;
  user: GHUser | null;
}

export interface GHRepo {
  archive_url: string;
  archived: boolean;
  assignees_url: string;
  blobs_url: string;
  clone_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  created_at: string | null;
  default_branch: string;
  deployments_url: string;
  description: string | null;
  disabled: boolean;
  downloads_url: string;
  events_url: string;
  fork: boolean;
  forks: number;
  forks_count: number;
  forks_url: string;
  full_name: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  has_downloads: boolean;
  has_issues: boolean;
  has_pages: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  homepage: string | null;
  hooks_url: string;
  html_url: string;
  id: number;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  language: null | string;
  languages_url: string;
  license: GHLicense | null;
  merges_url: string;
  milestones_url: string;
  mirror_url: null | string;
  name: string;
  node_id: string;
  notifications_url: string;
  open_issues: number;
  open_issues_count: number;
  owner: GHUser | null;
  permissions?: GHPermissions | undefined;
  private: boolean;
  pulls_url: string;
  pushed_at: string | null;
  releases_url: string;
  size: number;
  ssh_url: string;
  stargazers_count: number;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  svn_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  updated_at: string | null;
  url: string;
  watchers: number;
  watchers_count: number;
}

interface GHTeam {
  id: number;
  node_id: string;
  url: string;
  members_url: string;
  name: string;
  description: string | null;
  permission: string;
  privacy?: string | undefined;
  html_url: string;
  repositories_url: string;
  slug: string;
  ldap_dn?: string | undefined;
}

interface GHUser {
  avatar_url: string;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string | null;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;
}

export interface RCRepo extends GHRepo {
  pullRequests: GHPull[];
}

export type ResponseDataReposPullsGET = {
  repo: GHRepo;
  prs: GHPull[];
  pr_count: number;
}[];

export interface Token {
  _id?: string;
  // ? Rename to 'value'
  token: string;
}

export interface UserDocument extends Document {
  accessToken: string;
  generateAuthToken: () => Promise<string>;
  repos: GHRepo[];
  tokens: Token[];
}

export interface UserModel extends Model<UserDocument> {
  save: () => Promise<void>;
  id: string;
}
