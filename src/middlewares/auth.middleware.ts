import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authorizeUser = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { authorization } = req.headers;
	if (!authorization) {
		res.status(401).json({
			status: "failed",
			message: "You are not authorized to access this route",
		});
		return;
	}

	const token = authorization.split(" ")[1];
	if (!token) {
		res.status(401).json({
			status: "failed",
			message: "You are not authorized to access this route",
		});
		return;
	}

	jwt.verify(token, <string>process.env.JWT_KEY, (err, decoded) => {
		if (err) {
			res.status(401).json({
				status: "failed",
				message:
					"Invalid authorization token. You are not authorized to access this route",
			});
			return;
		}

		req.user = <{ email: string; category: string }>decoded;
		next();
	});
};
