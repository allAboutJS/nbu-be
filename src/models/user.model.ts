import { db } from "@config/db.config";
import bcrypt from "bcryptjs";
import type { Pool } from "pg";
import type { User } from "types.d";

export class UserModel {
	/** Database connection pool. */
	static db: Pool = db;

	/** Checks if a user with the specified email exists */
	static async userExists(email: string): Promise<boolean> {
		const query = "SELECT COUNT(*) FROM users WHERE email = $1";
		return (await UserModel.db.query(query, [email])).rows[0].count > 0;
	}

	/** Returns a found user by their email, or null if the user does not exist. */
	static async findByEmail(email: string): Promise<Required<User> | null> {
		const query = "SELECT * FROM users WHERE email = $1";
		const values = [email];

		return (await UserModel.db.query(query, values)).rows[0] || null;
	}

	/** Compare a plain password against a hash to see if they match. */
	static async comparePassword(plain: string, hashed: string) {
		return await bcrypt.compare(plain, hashed);
	}
}
