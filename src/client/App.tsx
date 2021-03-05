import * as React from "react";
import {
  BrowserRouter as Router,
  Redirect as BrowserRedirect,
  Switch,
  Route,
} from "react-router-dom";
import { Octokit } from "@octokit/rest";
import { response } from "express";

const Home = () => {
  const [accessToken, setAccessToken] = React.useState("");
  const [repos, setRepos] = React.useState<any>([]);

  React.useEffect(() => {
    const localStorageAcessToken = window.localStorage.getItem("accessToken");
    if (localStorageAcessToken) {
      setAccessToken(localStorageAcessToken);
    }
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

  const handleIntegrateWithGitHub = async () => {
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
      {!accessToken && (
        <button onClick={handleIntegrateWithGitHub}>
          Integrate with GitHub
        </button>
      )}
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
    window.localStorage.setItem("accessToken", accessToken);
    setAccessTokenSaved(true);
  }, [accessToken]);

  return accessTokenSaved ? <BrowserRedirect to="/" /> : <h1>REDIRECT</h1>;
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
