import authRouter from "@routes/auth.route";
import ticketRouter from "@routes/ticket.route";
import cors from "cors";
import { config } from "dotenv";
import express from "express";

// Configure environment variables
config();

const server = express();
const port = Number.parseInt(process.env.PORT ?? "8000");

server.use(cors());
server.use(express.json());

// Routes
server.use("/api/auth", authRouter);
server.use("/api/ticket", ticketRouter);

server.listen(port, () => {
	console.log("> Express server is listening on port:", port);
});
