import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home, Redirect, RepoDisplay } from "./pages";
import LoadingIndicator from "./components/LoadingIndicator";
import { Repo } from "./types";

const App: React.FunctionComponent<unknown> = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [repos, setRepos] = React.useState<Repo[]>([]);
  const [currentRepo, setCurrentRepo] = React.useState<Repo | null>(null);

  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path="/auth-final"
            children={
              <Redirect setIsLoading={setIsLoading} setRepos={setRepos} />
            }
          />
          <Route
            exact
            path="/"
            children={
              <Home
                isLoading={isLoading}
                repos={repos}
                setCurrentRepo={setCurrentRepo}
                setIsLoading={setIsLoading}
                setRepos={setRepos}
              />
            }
          />
          <Route
            path="/repos/:repoId"
            children={<RepoDisplay currentRepo={currentRepo} />}
          />
        </Switch>
      </Router>
      {isLoading && <LoadingIndicator />}
    </>
  );
};

export default App;
