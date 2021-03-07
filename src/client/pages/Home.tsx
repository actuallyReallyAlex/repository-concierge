import * as React from "react";
import { ResponseDataReposPullsGET } from "../../server/types";

interface HomeProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const Home: React.FunctionComponent<HomeProps> = (props: HomeProps) => {
  const { isLoading, setIsLoading } = props;
  const [accessToken, setAccessToken] = React.useState("");
  const [prRepos, setPRRepos] = React.useState<ResponseDataReposPullsGET>([]);

  React.useEffect(() => {
    setIsLoading(true);
    fetch("/users/me")
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setAccessToken(data.accessToken);
          setIsLoading(false);
        }
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

  const handlePRs = async () => {
    setIsLoading(true);
    const response = await fetch("/repos/pull-requests", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });
    console.log(response);
    const data: ResponseDataReposPullsGET = await response.json();
    console.log(data);
    setPRRepos(data);
    setIsLoading(false);
  };

  return (
    <div>
      <h1>repository-concierge</h1>
      {!accessToken && (
        <button disabled={isLoading} onClick={handleLogIn}>
          Log in
        </button>
      )}
      {accessToken && (
        <button disabled={isLoading} onClick={handlePRs}>
          PRs
        </button>
      )}
      {prRepos.length > 0 && (
        <div>
          <h2>Repos with Open PRs</h2>
          <ol>
            {prRepos.map(({ repo, prs, pr_count }) => (
              <li key={repo.id}>
                <a
                  href={prs[0].html_url}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {repo.name} - {pr_count} open PRs
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Home;
