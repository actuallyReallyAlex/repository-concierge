import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Home = () => {
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
      <button onClick={handleIntegrateWithGitHub}>Integrate with GitHub</button>
    </div>
  );
};

const Redirect = () => {
  console.log(window.location);
  return <h1>REDIRECT</h1>;
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
