import * as React from "react";
import { RCRepo } from "../types";

export interface RepoDisplayFormProps {
  repos: RCRepo[];
  setFilteredRepos: (filteredRepos: RCRepo[]) => void;
}

const RepoDisplayForm: React.FunctionComponent<RepoDisplayFormProps> = (
  props: RepoDisplayFormProps
) => {
  const { repos, setFilteredRepos } = props;
  const [allRepos, setAllRepos] = React.useState(false);
  const [openPRs, setOpenPRs] = React.useState(true);

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    if (!allRepos) {
      setFilteredRepos(repos);
    } else {
      setFilteredRepos(repos.filter((repo) => repo.pullRequests.length > 0));
    }
  };

  const handleAllReposChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllRepos(e.target.checked);
    setOpenPRs(!e.target.checked);
  };
  const handleOpenPRsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenPRs(e.target.checked);
    setAllRepos(!e.target.checked);
  };

  return (
    <form onChange={handleFormChange}>
      <label>All Repos</label>
      <input
        checked={allRepos}
        onChange={handleAllReposChange}
        type="checkbox"
      />
      <label>Open PRs</label>
      <input checked={openPRs} onChange={handleOpenPRsChange} type="checkbox" />
    </form>
  );
};

export default RepoDisplayForm;
