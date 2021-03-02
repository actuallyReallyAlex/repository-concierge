import chalk from "chalk";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import path from "path";

import rateLimiter from "./middleware/rateLimiter";

import { Controller } from "./types";

class App {
  public app: express.Application;

  public port: string;

  constructor(controllers: Controller[], port: string) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares(): void {
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(compression());
    if (process.env.NODE_ENV === "production") {
      this.app.use(rateLimiter);
    }
    if (process.env.NODE_ENV !== "test") {
      this.app.use(morgan("dev"));
    }

    const whitelistDomains = [
      "http://localhost:3000",
      "http://localhost:5000",
      undefined,
    ];

    const corsOptions: CorsOptions = {
      origin: (
        requestOrigin: string | undefined,
        callback: (error: Error | null, success?: boolean | undefined) => void
      ): void => {
        if (whitelistDomains.indexOf(requestOrigin) !== -1) {
          callback(null, true);
        } else {
          console.error(`Sever refused to allow: ${requestOrigin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
    };

    this.app.use(cors(corsOptions));
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });

    this.app.use(express.static(path.join(__dirname, "../dist")));

    this.app.get("/robots.txt", (req: Request, res: Response) =>
      res.sendFile(path.join(__dirname, `/assets/robots.txt`))
    );

    this.app.get("*", (req: Request, res: Response) => {
      try {
        return res.send("Hello, World!");
        // if (
        //   req.headers.host === "localhost:3000" &&
        //   process.env.NODE_ENV === "development" &&
        //   req.path === "/"
        // ) {
        //   return res.send();
        // }
        // res.sendFile(path.join(__dirname, "/dist/index.html"));
      } catch (error) {
        console.error("Error in Main Router");
        console.error(error);
      }
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`\nMode: ${chalk.blue(process.env.NODE_ENV)}\n`);
      console.log(`Server is listening on port: ${chalk.blue(this.port)}\n`);
      console.log(
        `Visit ${chalk.blue(
          `http://localhost:${this.port}/`
        )} to view project\n`
      );
    });
  }
}

export default App;
