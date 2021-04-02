import * as React from "react";
import { RCRepo } from "../types";

interface RepoDisplayProps {
  currentRepo: RCRepo | null;
}

export const RepoDisplay: React.FunctionComponent<RepoDisplayProps> = (
  props: RepoDisplayProps
) => {
  const { currentRepo } = props;
  if (!currentRepo) {
    return <span>NO CURRENT REPO</span>;
  }
  return (
    <div>
      <h1>{currentRepo.name}</h1>
    </div>
  );
};

export default RepoDisplay;
