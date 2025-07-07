import { z } from "zod";

export const loginDto = z.object(
	{
		email: z
			.string({ message: "email must be a string" })
			.email("email is invalid"),
		password: z
			.string({ message: "password must be a string" })
			.min(6, "password is too short")
			.regex(/^[^\s]*$/, "Spaces are not allowed in passwords"),
	},
	{ message: "Expected registration payload to be an object" },
);
