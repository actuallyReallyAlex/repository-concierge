import App from "./app";

import AssetsController from "./controllers/Assets";
import GitHubController from "./controllers/GitHub";

import { Controller } from "./types";

const main = async (): Promise<void> => {
  try {
    if (!process.env.PORT) throw new Error("No PORT");

    const controllers: Controller[] = [
      new AssetsController(),
      new GitHubController(),
    ];

    const app = new App(controllers, process.env.PORT);

    app.listen();
  } catch (error) {
    console.error(error);
  }
};

main();
