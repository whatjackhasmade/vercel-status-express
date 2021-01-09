import { Request, NextFunction } from "express";

const middlewareAsync = (handler: any) => {
	return async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			await handler(req, res);
		} catch (ex) {
			next(ex);
		}
	};
};

export { middlewareAsync };
