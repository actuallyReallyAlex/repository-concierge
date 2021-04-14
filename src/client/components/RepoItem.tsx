import * as React from "react";
import { Badge, List, Tag } from "antd";
import { RCRepo } from "../types";

const languageColors: {
  [key: string]: string;
} = {
  CSS: "purple",
  HTML: "red",
  JavaScript: "green",
  TypeScript: "cyan",
};

interface RepoItemProps {
  handleClickPullRequests: () => void;
  handleClickSettings: () => void;
  repo: RCRepo;
}

const RepoItem: React.FunctionComponent<RepoItemProps> = (
  props: RepoItemProps
) => {
  const { handleClickPullRequests, handleClickSettings, repo } = props;

  return (
    <List.Item
      actions={[
        <div onClick={handleClickPullRequests}>
          <span>Pull Requests</span>
          <Badge count={repo.pullRequests.length} offset={[0, -10]} />
        </div>,
        <span onClick={handleClickSettings}>Settings</span>,
      ]}
    >
      <List.Item.Meta description={repo.description} title={repo.name} />
      <div>
        <Tag color={repo.language ? languageColors[repo.language] : "blue"}>
          {repo.language}
        </Tag>
      </div>
    </List.Item>
  );
};

export default RepoItem;
