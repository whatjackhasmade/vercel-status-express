import express, { Application } from "express";
import "express-async-errors";

import { logger } from "vercel-status";

const app: Application = express();

// create a write stream (in append mode)
// setup the logger
process.on("uncaughtException", ex => {
  logger.error(ex.message, ex);
});

process.on("unhandledRejection", ex => {
  logger.error("unhandledRejection", ex);
});

export { app };
