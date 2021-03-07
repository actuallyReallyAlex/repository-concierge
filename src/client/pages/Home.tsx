import * as React from "react";
import { ResponseDataReposPullsGET } from "../../server/types";

interface HomeProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const Home: React.FunctionComponent<HomeProps> = (props: HomeProps) => {
  const { setIsLoading } = props;
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
      {!accessToken && <button onClick={handleLogIn}>Log in</button>}
      {accessToken && <button onClick={handlePRs}>PRs</button>}
      {prRepos.length > 0 && (
        <div>
          <h2>Repos with Open PRs</h2>
          <ol>
            {prRepos.map((prRepo) => (
              <li key={prRepo.repo.id}>
                {prRepo.repo.name} - {prRepo.pr_count} open PRs
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Home;
