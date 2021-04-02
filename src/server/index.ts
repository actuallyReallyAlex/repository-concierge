import App from "./app";

import AssetsController from "./controllers/Assets";
import AuthController from "./controllers/Auth";
import UserController from "./controllers/User";

import { Controller } from "./types";

const main = async (): Promise<void> => {
  try {
    if (!process.env.PORT) throw new Error("No PORT");
    if (!process.env.MONGODB_URL) throw new Error("No MONGODB_URL");

    const controllers: Controller[] = [
      new AssetsController(),
      new AuthController(),
      new UserController(),
    ];

    const app = new App(controllers, process.env.PORT, process.env.MONGODB_URL);

    app.listen();
  } catch (error) {
    console.error(error);
  }
};

main();
