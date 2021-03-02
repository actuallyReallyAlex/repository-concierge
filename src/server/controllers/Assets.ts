import express, { Router, Request, Response } from "express";
import path from "path";

class AssetsController {
  public router: Router = express.Router();

  static assetList = [];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    AssetsController.assetList.forEach((asset: string) => {
      this.router.get(
        `/assets/${asset}`,
        async (req: Request, res: Response) => {
          try {
            const filePath = path.join(__dirname, `../assets/${asset}`);
            return res.sendFile(filePath);
          } catch (error) {
            console.error(error);
            return res.status(500).send();
          }
        }
      );
    });
  }
}

export default AssetsController;
