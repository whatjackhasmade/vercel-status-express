import express from "express";

const middlewareLogger = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
): void => {
	console.info(`${req.method} : ${req.originalUrl}`);
	next();
};
export { middlewareLogger };
