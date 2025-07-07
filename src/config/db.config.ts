import { config } from "dotenv";
import { Pool } from "pg";

// Configure environment variables
config();

export const db = new Pool({
	connectionString: process.env.DATABASE_URL,
});
