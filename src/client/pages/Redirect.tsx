import * as React from "react";
import { Redirect as BrowserRedirect } from "react-router-dom";
import { RCRepo, UserDocument } from "../types";

interface RedirectProps {
  setIsLoading: (isLoading: boolean) => void;
  setRepos: (repos: RCRepo[]) => void;
}

export const Redirect: React.FunctionComponent<RedirectProps> = (
  props: RedirectProps
) => {
  const { setIsLoading, setRepos } = props;
  const [accessTokenSaved, setAccessTokenSaved] = React.useState(false);
  const accessToken = window.location.search.split("=")[1];
  React.useEffect(() => {
    setIsLoading(true);
    fetch("/users", {
      body: JSON.stringify({ accessToken }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response: Response) => {
        if (response.status !== 201) {
          console.error("Error!");
        } else {
          response.json().then((user: UserDocument) => {
            setAccessTokenSaved(true);
            setRepos(user.repos);
            setIsLoading(false);
          });
        }
      })
      .catch((error) => console.error(error));
  }, [accessToken]);

  return accessTokenSaved ? <BrowserRedirect to="/" /> : null;
};

export default Redirect;
