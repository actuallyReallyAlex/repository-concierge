import * as React from "react";
import {
  BrowserRouter as Router,
  Redirect as BrowserRedirect,
  Switch,
  Route,
} from "react-router-dom";
import { Octokit } from "@octokit/rest";

const Home = () => {
  const [accessToken, setAccessToken] = React.useState("");
  const [repos, setRepos] = React.useState<any>([]);

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

  React.useEffect(() => {
    if (accessToken) {
      const octokit = new Octokit({ auth: accessToken });

      octokit.repos
        .listForAuthenticatedUser({ per_page: 100 })
        .then((response) => setRepos(response.data))
        .catch((error) => console.error(error));
    }
  }, [accessToken]);

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

  return (
    <div>
      <h1>repository-concierge</h1>
      {!accessToken && <button onClick={handleLogIn}>Log in</button>}
      {repos && (
        <ol>
          {repos.map((repo: { id: React.Key; name: React.ReactNode }) => (
            <li key={repo.id}>{repo.name}</li>
          ))}
        </ol>
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
      .then((response) => response.json())
      .then((data) => {
        console.log({ data });
        setAccessTokenSaved(true);
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
