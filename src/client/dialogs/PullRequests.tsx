import * as React from "react";
import { Table, Space } from "antd";
import { GHPull } from "../types";

interface Datum {
  author: string;
  key: number;
  title: string;
  url: string;
}

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "Action",
    key: "action",
    render: (datum: Datum) => {
      return (
        <Space size="middle">
          <a href={datum.url} rel="noopener noreferrer" target="_blank">
            View
          </a>
        </Space>
      );
    },
  },
];

const createDataSource = (pullRequests: GHPull[]): Datum[] => {
  return pullRequests.map((pullRequest) => ({
    author: pullRequest.user?.login || "Unknown",
    key: pullRequest.id,
    title: pullRequest.title,
    url: pullRequest.html_url,
  }));
};

interface PullRequestsProps {
  pullRequests: GHPull[];
}

const PullRequests: React.FunctionComponent<PullRequestsProps> = (
  props: PullRequestsProps
) => {
  const { pullRequests } = props;
  if (pullRequests) {
    return (
      <Table columns={columns} dataSource={createDataSource(pullRequests)} />
    );
  } else {
    return null;
  }
};

export default PullRequests;
