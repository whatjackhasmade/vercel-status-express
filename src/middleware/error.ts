import { Response, Request } from "express";
import { logger } from "vercel-status";

const middlewareError = (err: Error, _: Request, res: Response): void => {
  logger.error(`${err.message} `, err);
  res.status(500).send(`Err: 500, Someting went Wrong, ${err}`);
};
export { middlewareError };
