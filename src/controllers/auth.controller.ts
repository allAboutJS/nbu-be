import { UserModel } from "@models/user.model";
import formatZodError from "@utils/formatZodError.util";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginDto } from "src/dtos/auth.dto";
import type { User } from "types.d";

/** Handler for retrieving authorized user's information */
export const getAuthUser = async (req: Request, res: Response) => {
	const user = await UserModel.findByEmail(req.user!.email);

	if (!user) {
		res.status(401).json({
			status: "failed",
			message: "User not found",
		});
		return;
	}

	res.json({
		status: "successful",
		data: { user },
	});
};

/** Handler for admin login. */
export const signin = async (req: Request, res: Response) => {
	const validationResult = loginDto.safeParse(req.body);
	if (!validationResult.success) {
		res.status(400).json({
			status: "failed",
			message: "Invalid request body. Check your inputs and try again",
			errors: formatZodError(validationResult.error),
		});
		return;
	}

	const { email, password } = validationResult.data;
	if (!(await UserModel.userExists(email))) {
		res.status(401).json({
			status: "failed",
			message: "Incorrect email, or password",
		});
		return;
	}

	const { password_hash, category } = <Required<User>>(
		await UserModel.findByEmail(email)
	);
	if (!(await UserModel.comparePassword(password, password_hash))) {
		res.status(401).json({
			status: "failed",
			message: "Incorrect email, or password",
		});
		return;
	}

	const token = jwt.sign({ email, category }, <string>process.env.JWT_KEY, {
		expiresIn: "3d",
	});

	res.status(201).json({
		status: "successful",
		message: "Login successful",
		data: {
			token,
		},
	});
};
