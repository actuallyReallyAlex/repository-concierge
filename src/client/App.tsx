import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home, Redirect, RepoDisplay } from "./pages";
import LoadingIndicator from "./components/LoadingIndicator";
import { RCRepo } from "./types";

const App: React.FunctionComponent<unknown> = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [repos, setRepos] = React.useState<RCRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = React.useState<RCRepo[]>(
    repos.filter((repo) => repo.pullRequests.length > 0)
  );
  const [currentRepo, setCurrentRepo] = React.useState<RCRepo | null>(null);

  React.useEffect(() => {
    setFilteredRepos(repos.filter((repo) => repo.pullRequests.length > 0));
  }, [repos]);

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
                filteredRepos={filteredRepos}
                isLoading={isLoading}
                repos={repos}
                setCurrentRepo={setCurrentRepo}
                setFilteredRepos={setFilteredRepos}
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
