import { Button, Layout, List, Typography } from "antd";
import * as React from "react";
import Dialog from "../components/Dialog";
import RepoDisplayForm from "../components/RepoDisplayForm";
import RepoItem from "../components/RepoItem";
import { GHPull, RCRepo, UserDocument } from "../types";

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
    setFilteredRepos,
    setIsLoading,
    setRepos,
  } = props;
  const [accessToken, setAccessToken] = React.useState("");
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [pullRequests, setPullRequests] = React.useState<GHPull[]>([]);

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

  const handleClickPullRequests = (pullRequests: GHPull[]) => {
    setPullRequests(pullRequests);
    setModalTitle("Pull Requests");
    setIsModalVisible(true);
  };

  const handleClickSettings = () => {
    setModalTitle("Settings");
    setIsModalVisible(true);
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
            <RepoItem
              handleClickPullRequests={() =>
                handleClickPullRequests(repo.pullRequests)
              }
              handleClickSettings={handleClickSettings}
              repo={repo}
            />
          )}
        ></List>
      </Layout.Content>
      <Layout.Footer className="footer">Footer</Layout.Footer>
      <Dialog
        pullRequests={pullRequests}
        setIsModalVisible={setIsModalVisible}
        setModalTitle={setModalTitle}
        setPullRequests={setPullRequests}
        title={modalTitle}
        visible={isModalVisible}
      />
    </Layout>
  );
};

export default Home;
