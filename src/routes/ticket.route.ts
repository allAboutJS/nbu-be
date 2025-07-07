import * as TicketController from "@controllers/ticket.controller";
import { Router } from "express";
import { authorizeUser } from "src/middlewares/auth.middleware";

const ticketRouter = Router();

ticketRouter.post("/new", TicketController.createTicket);

// Use middleware for routes below
ticketRouter.use(authorizeUser);
ticketRouter.get("/all", TicketController.getTickets);
ticketRouter.get("/:id", TicketController.getTicket);
ticketRouter.patch("/:id/update", TicketController.updateTicket);

export default ticketRouter;
