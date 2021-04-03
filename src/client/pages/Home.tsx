import * as React from "react";
import RepoDisplayForm from "../components/RepoDisplayForm";
import RepoItem from "../components/RepoItem";
import { RCRepo, UserDocument } from "../types";

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
    <div>
      <h1>repository-concierge</h1>
      {!accessToken && (
        <button disabled={isLoading} onClick={handleLogIn}>
          Log in
        </button>
      )}
      {repos.length > 0 && (
        <>
          <h2>Repos</h2>
          <RepoDisplayForm repos={repos} setFilteredRepos={setFilteredRepos} />
        </>
      )}
      {filteredRepos.map((repo) => (
        <RepoItem key={repo.id} repo={repo} setCurrentRepo={setCurrentRepo} />
      ))}
    </div>
  );
};

export default Home;
