import * as React from "react";
import { Link } from "react-router-dom";
import { Repo, UserDocument } from "../types";

interface HomeProps {
  isLoading: boolean;
  repos: Repo[];
  setCurrentRepo: (currentRepo: Repo) => void;
  setIsLoading: (isLoading: boolean) => void;
  setRepos: (repos: Repo[]) => void;
}

export const Home: React.FunctionComponent<HomeProps> = (props: HomeProps) => {
  const { isLoading, repos, setCurrentRepo, setIsLoading, setRepos } = props;
  const [accessToken, setAccessToken] = React.useState("");

  React.useEffect(() => {
    setIsLoading(true);
    fetch("/users/me")
      .then((response) => response.json())
      .then((data: UserDocument | { error: any }) => {
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
      {repos.length > 0 && <h2>Repos</h2>}
      {repos.map((repo) => (
        <div key={repo.id}>
          <Link onClick={() => setCurrentRepo(repo)} to={`/repos/${repo.name}`}>
            <h3>{repo.name}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
