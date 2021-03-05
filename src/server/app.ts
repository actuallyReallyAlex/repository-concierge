import chalk from "chalk";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

import rateLimiter from "./middleware/rateLimiter";
import config from "./webpack.config";

import { Controller } from "./types";

const compiler = webpack(config);

const parseLocals = (res: any) => {
  const { devMiddleware } = res.locals.webpack;
  const outputFileSystem = devMiddleware;
  const jsonWebpackStats = devMiddleware.stats.toJson();
  const { assetsByChunkName, outputPath } = jsonWebpackStats;
  const chunkPaths: string[][] = Object.values(assetsByChunkName);
  const assets = chunkPaths.map((fileArr) => fileArr[0]);
  return { assets, outputFileSystem, outputPath };
};

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
    if (process.env.NODE_ENV === "development") {
      this.app.use(webpackDevMiddleware(compiler, { serverSideRender: true }));
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

    this.app.get("/robots.txt", (req: Request, res: Response) =>
      res.sendFile(path.join(__dirname, `/assets/robots.txt`))
    );

    this.app.use((req, res) => {
      const { assets, outputFileSystem, outputPath } = parseLocals(res);
      return res.send(`
      <html>
        <head>
          <title>repository-concierge</title>
          <style>
          ${assets
            .filter((path) => path.endsWith(".css"))
            .map((path) =>
              outputFileSystem.readFileSync(path.concat(outputPath, path))
            )
            .join("\n")}
          </style>
        </head>
        <body>
          <div id="root"></div>
          ${assets
            .filter((path) => path.endsWith(".js"))
            .map((path) => `<script src="${path}"></script>`)
            .join("\n")}
        </body>
      </html>
        `);
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
