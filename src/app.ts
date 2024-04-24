import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import { zodMiddleware } from "./middleware/zod.middleware";
import morganMiddleware from "./middleware/morgan.middleware";
import { handleErrors, notFound } from "./middleware/handleErrors.middleware";
import router from "./router";

const app: Application = express();

app.enable("trust proxy");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use(cors());
app.use(helmet());
app.use(zodMiddleware);

// Base route
router.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Welcome to Farmease backend",
  });
});

app.use("/api/v1", router);

app.use(notFound);
app.use(handleErrors);

// add api not found handler
app.use("*", (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "API not found",
  });
});

export default app;
