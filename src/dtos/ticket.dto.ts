import { z } from "zod";

export const createTicketDto = z.object({
	title: z
		.string({ message: "Title must be a string" })
		.trim()
		.nonempty({ message: "Title cannot be empty" })
		.min(2, { message: "Title is too short" }),

	description: z
		.string({ message: "Description must be a string" })
		.trim()
		.nonempty({ message: "Description cannot be empty" }),

	category: z.enum(
		["technical", "billing", "general", "admissions", "it_support", "finance"],
		{ message: "Invalid category" },
	),
});

export const updateTicketDto = z.object({
	status: z
		.enum(["open", "in_progress", "completed"], {
			errorMap: () => ({ message: "Invalid status" }),
		})
		.optional(),
});
