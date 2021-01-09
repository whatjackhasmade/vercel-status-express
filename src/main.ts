import bearerToken from "express-bearer-token";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import http from "http";
dotenv.config();

// Common
import { app } from "vercel-status";
import { logger } from "vercel-status";

// Controllers
import { api } from "vercel-status";

const PORT: number = Number(process.env.PORT) || 5000;
const env: string = process.env.NODE_ENV || "dev";
const urlFrontend: string = process.env.URL_FRONTEND || "";
const urlLocal: string = process.env.URL_LOCAL || "";

const server = http.createServer(app);

const auth: string[] = [urlFrontend, urlLocal];

const corsConfig = {
  credentials: true,
  origin: auth,
};

app.use(cors(corsConfig));

// Set helemet
app.use(helmet());

// Accept bearer token authentication
app.use(bearerToken());

// Accept form data in requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Parse cookie sent in requests
app.use(cookieParser());

// Controllers - Index
app.get("/:username/:repo", api.getStatusFromRepo);

server.listen(PORT);

server.on("listening", () => {
  logger.info(`${env} server up listening on http://localhost:${PORT}`);
});
