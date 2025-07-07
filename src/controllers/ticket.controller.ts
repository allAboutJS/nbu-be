import { TicketModel } from "@models/ticket.model";
import formatZodError from "@utils/formatZodError.util";
import type { Request, Response } from "express";
import { createTicketDto, updateTicketDto } from "src/dtos/ticket.dto";

/** Handler for creating new tickets. */
export const createTicket = async (req: Request, res: Response) => {
	const validationResult = createTicketDto.safeParse(req.body);
	if (!validationResult.success) {
		res.status(400).json({
			message: "Invalid request body. Check your inputs and try again",
			errors: formatZodError(validationResult.error),
		});
		return;
	}

	await TicketModel.save(validationResult.data);
	res.status(201).json({ message: "Ticket created successfully" });
};

/** Handler for updating existing tickets */
export const updateTicket = async (req: Request, res: Response) => {
	const validationResult = updateTicketDto.safeParse(req.body);
	if (!validationResult.success) {
		res.status(400).json({
			message: "Invalid request body. Check your inputs and try again",
			errors: formatZodError(validationResult.error),
		});
		return;
	}

	const { id } = req.params;
	await TicketModel.updateOne(id, validationResult.data);
	res.status(201).json({ message: "Ticket updated successfully" });
};

/** Handler for retrieving tickets based on user category. */
export const getTickets = async (req: Request, res: Response) => {
	res.status(201).json({
		message: "Tickets retrieved successfully",
		data: { tickets: await TicketModel.findByCategory(req.user!.category) },
	});
};

/** Handler for retrieving a single ticket by id. */
export const getTicket = async (req: Request, res: Response) => {
	const validationResult = updateTicketDto.safeParse(req.body);
	if (!validationResult.success) {
		res.status(400).json({
			message: "Invalid request body. Check your inputs and try again",
			errors: formatZodError(validationResult.error),
		});
		return;
	}

	const ticket = await TicketModel.findOneById(req.params.id);
	if (!ticket) {
		res.status(404).json({
			message: "This ticket does not exist",
		});
		return;
	}

	if (ticket.category !== req.user?.category) {
		res.status(404).json({
			message: "You are not authorized to view this ticket",
		});
		return;
	}

	res.status(201).json({
		message: "Tickets retrieved successfully",
		data: { ticket },
	});
};
