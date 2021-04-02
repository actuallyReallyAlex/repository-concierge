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
      <Link onClick={() => setCurrentRepo(repo)} to={`/repos/${name}`}>
        <h3>{name}</h3>
        {!pullRequests && <span>PROCESSING PULL REQUESTS</span>}
      </Link>
    </div>
  );
};

export default RepoItem;
