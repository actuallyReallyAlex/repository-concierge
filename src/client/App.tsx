import * as React from "react";

const App: React.FunctionComponent<unknown> = () => {
  const handleIntegrateWithGitHub = async () => {
    const response = await fetch("/gh", {
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

export default App;
