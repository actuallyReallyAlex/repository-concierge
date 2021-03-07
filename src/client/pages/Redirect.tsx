import * as React from "react";
import { Redirect as BrowserRedirect } from "react-router-dom";

interface RedirectProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const Redirect: React.FunctionComponent<RedirectProps> = (
  props: RedirectProps
) => {
  const { setIsLoading } = props;
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
      .then((response) => {
        if (response.status !== 201) {
          console.error("Error!");
        } else {
          setAccessTokenSaved(true);
          setIsLoading(false);
        }
      })
      .catch((error) => console.error(error));
  }, [accessToken]);

  return accessTokenSaved ? <BrowserRedirect to="/" /> : null;
};

export default Redirect;
