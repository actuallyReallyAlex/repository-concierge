import * as React from "react";
import {
  BrowserRouter as Router,
  Redirect as BrowserRedirect,
  Switch,
  Route,
} from "react-router-dom";
import { ResponseDataReposPullsGET } from "../server/types";

const Home = () => {
  const [accessToken, setAccessToken] = React.useState("");
  const [prRepos, setPRRepos] = React.useState<ResponseDataReposPullsGET>([]);

  React.useEffect(() => {
    fetch("/users/me")
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setAccessToken(data.accessToken);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  // React.useEffect(() => {
  //   if (accessToken) {

  //   }
  // }, [accessToken]);

  const handleLogIn = async () => {
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

    window.location.assign(body.url);
  };

  const handlePRs = async () => {
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

const Redirect = () => {
  const [accessTokenSaved, setAccessTokenSaved] = React.useState(false);
  const accessToken = window.location.search.split("=")[1];
  React.useEffect(() => {
    fetch("/users", {
      body: JSON.stringify({ accessToken }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response) => {
        if (response.status !== 201) {
          console.error("Error!");
        } else {
          setAccessTokenSaved(true);
        }
      })
      .catch((error) => console.error(error));
  }, [accessToken]);

  return accessTokenSaved ? <BrowserRedirect to="/" /> : null;
};

const App: React.FunctionComponent<unknown> = () => {
  return (
    <Router>
      <Switch>
        <Route path="/auth-final" children={<Redirect />} />
        <Route path="/" children={<Home />} />
      </Switch>
    </Router>
  );
};

export default App;
