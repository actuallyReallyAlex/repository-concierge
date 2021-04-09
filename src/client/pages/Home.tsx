import { Badge, Button, Layout, List, Tag, Typography } from "antd";
import * as React from "react";
import { Link } from "react-router-dom";
import RepoDisplayForm from "../components/RepoDisplayForm";
import { RCRepo, UserDocument } from "../types";

const languageColors: {
  [key: string]: string;
} = {
  CSS: "purple",
  HTML: "red",
  JavaScript: "green",
  TypeScript: "cyan",
};

interface HomeProps {
  filteredRepos: RCRepo[];
  isLoading: boolean;
  repos: RCRepo[];
  setCurrentRepo: (currentRepo: RCRepo) => void;
  setFilteredRepos: (filteredRepos: RCRepo[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setRepos: (repos: RCRepo[]) => void;
}

export const Home: React.FunctionComponent<HomeProps> = (props: HomeProps) => {
  const {
    filteredRepos,
    isLoading,
    repos,
    setCurrentRepo,
    setFilteredRepos,
    setIsLoading,
    setRepos,
  } = props;
  const [accessToken, setAccessToken] = React.useState("");
  const [pageSize, setPageSize] = React.useState(5);

  React.useEffect(() => {
    setIsLoading(true);
    fetch("/users/me")
      .then((response) => response.json())
      .then((data: UserDocument | { error: string }) => {
        if ("error" in data) {
          console.error(data.error);
          return setIsLoading(false);
        }
        setAccessToken(data.accessToken);
        setRepos(data.repos);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleLogIn = async () => {
    setIsLoading(true);
    const response = await fetch("/auth", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.status !== 200) {
      throw new Error("Error in OAuth flow");
    }

    const body = await response.json();

    setIsLoading(false);
    window.location.assign(body.url);
  };

  return (
    <Layout className="layout">
      <Layout.Header className="header">
        <Typography.Title>repository-concierge</Typography.Title>
      </Layout.Header>
      <Layout.Content className="content">
        {!accessToken && (
          <Button disabled={isLoading} onClick={handleLogIn} type="primary">
            Log in
          </Button>
        )}
        {repos.length > 0 && (
          <>
            <Typography.Title level={2}>Repos</Typography.Title>
            <RepoDisplayForm
              repos={repos}
              setFilteredRepos={setFilteredRepos}
            />
          </>
        )}
        <List
          bordered
          dataSource={filteredRepos}
          itemLayout="horizontal"
          pagination={{
            defaultCurrent: 1,
            onShowSizeChange: (current, size) => {
              setPageSize(size);
            },
            pageSize,
            pageSizeOptions: ["5", "10", "25", "50", "100"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            total: filteredRepos.length,
          }}
          renderItem={(repo) => (
            <List.Item
              actions={[
                <Link to={`/repos/${repo.name}`}>
                  <span>Pull Requests</span>
                  <Badge count={repo.pullRequests.length} offset={[0, -15]} />
                </Link>,
                <Link
                  onClick={() => setCurrentRepo(repo)}
                  to={`/repos/${repo.name}`}
                >
                  <span>Settings</span>
                </Link>,
              ]}
            >
              <List.Item.Meta
                description={repo.description}
                title={repo.name}
              />
              <div>
                <Tag
                  color={repo.language ? languageColors[repo.language] : "blue"}
                >
                  {repo.language}
                </Tag>
              </div>
            </List.Item>
          )}
        ></List>
      </Layout.Content>
      <Layout.Footer className="footer">Footer</Layout.Footer>
    </Layout>
  );
};

export default Home;
