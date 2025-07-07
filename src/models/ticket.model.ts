import { db } from "@config/db.config";
import type { Ticket } from "types";

export class TicketModel {
	/** Database connection pool. */
	static db = db;

	/** Saves a new ticket */
	static async save(
		payload: Omit<Ticket, "id" | "status" | "created_at" | "updated_at">,
	): Promise<Required<Ticket>> {
		const query =
			"INSERT INTO tickets (title, description, category) VALUES ($1, $2, $3) RETURNING *";
		const values = [
			payload.title,
			payload.description || null,
			payload.category,
		];

		return (await db.query(query, values)).rows[0];
	}

	/** Find all tickets belonging to a category. */
	static async findByCategory(category: string): Promise<Ticket[]> {
		const query =
			"SELECT * FROM tickets WHERE category = $1 ORDER BY created_at DESC";
		const values = [category];

		return (await db.query<Ticket>(query, values)).rows;
	}

	/** Find one ticket by its ID. */
	static async findOneById(id: string): Promise<Ticket | null> {
		const query = "SELECT * FROM tickets WHERE id = $1";
		const values = [id];

		return (await db.query<Ticket>(query, values)).rows[0] || null;
	}

	/** Updates a ticket. */
	static async updateOne(
		id: string,
		updates: Partial<Omit<Ticket, "id">>,
	): Promise<Ticket | null> {
		let query = "UPDATE tickets SET ";
		const updateKeys = Object.keys(updates);
		const values: string[] = [];

		for (let i = 0; i < updateKeys.length; i++) {
			const columnName = updateKeys[i];
			query += `${columnName} = $${i + 1} `;
			values.push(updates[<keyof Omit<Ticket, "id">>columnName]!);
		}

		values.push(id);
		query += `WHERE id = $${updateKeys.length + 1} RETURNING *`;
		return (await db.query<Ticket>(query, values)).rows[0] || null;
	}
}
