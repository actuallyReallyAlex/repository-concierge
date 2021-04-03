import * as React from "react";
import { Link } from "react-router-dom";
import { RCRepo } from "../types";

interface RepoItemProps {
  repo: RCRepo;
  setCurrentRepo: (currentRepo: RCRepo) => void;
}

const RepoItem: React.FunctionComponent<RepoItemProps> = (
  props: RepoItemProps
) => {
  const { repo, setCurrentRepo } = props;
  const { name, pullRequests } = repo;

  return (
    <div>
      <a href={repo.html_url} rel="noopener noreferrer" target="_blank">
        <h3>{name}</h3>
      </a>
      {pullRequests === undefined && <span>PROCESSING PULL REQUESTS</span>}
      {pullRequests && <span>{pullRequests.length} OPEN PULL REQUESTS</span>}
      <Link onClick={() => setCurrentRepo(repo)} to={`/repos/${name}`}>
        <span>Settings</span>
      </Link>
    </div>
  );
};

export default RepoItem;
