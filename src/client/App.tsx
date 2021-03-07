import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home, Redirect } from "./pages";
import LoadingIndicator from "./components/LoadingIndicator";

const App: React.FunctionComponent<unknown> = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <>
      <Router>
        <Switch>
          <Route
            path="/auth-final"
            children={<Redirect setIsLoading={setIsLoading} />}
          />
          <Route path="/" children={<Home setIsLoading={setIsLoading} />} />
        </Switch>
      </Router>
      {isLoading && <LoadingIndicator />}
    </>
  );
};

export default App;
