import app from "./app";
import Server from "http";
import logger from "./utils/logger";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const PORT = process.env.PORT || 8000;

const server = Server.createServer(app);

server.listen(PORT, () => {
  logger.info(`App running at http://localhost:${PORT}`);
});
