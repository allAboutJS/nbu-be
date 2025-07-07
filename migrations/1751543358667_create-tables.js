/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = async (pgm) => {
	pgm.createType("ticket_status", ["open", "in_progress", "completed"]);

	pgm.createTable("users", {
		id: {
			type: "uuid",
			primaryKey: true,
			default: pgm.func("gen_random_uuid()"),
		},
		first_name: { type: "varchar(100)", notNull: true },
		last_name: { type: "varchar(100)", notNull: true },
		email: { type: "varchar(255)", notNull: true, unique: true },
		password_hash: { type: "varchar(255)", notNull: true },
		category: { type: "varchar(100)", notNull: true },
		created_at: {
			type: "timestamp with time zone",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
	});

	pgm.createTable("tickets", {
		id: {
			type: "uuid",
			primaryKey: true,
			default: pgm.func("gen_random_uuid()"),
		},
		title: { type: "varchar(255)", notNull: true },
		description: { type: "text" },
		category: { type: "varchar(100)", notNull: true },
		status: {
			type: "ticket_status",
			notNull: true,
			default: "open",
		},
		created_at: {
			type: "timestamp with time zone",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
		updated_at: {
			type: "timestamp with time zone",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
	});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = async (pgm) => {
	pgm.dropTable("tickets");
	pgm.dropTable("users");
	pgm.dropType("ticket_status");
};
