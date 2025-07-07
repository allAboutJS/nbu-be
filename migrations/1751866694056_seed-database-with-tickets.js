export const shorthands = undefined;

/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
export const up = async (pgm) => {
	const categories = [
		"technical",
		"billing",
		"general",
		"admissions",
		"it_support",
		"finance",
	];

	const statuses = ["open", "in_progress", "completed"];

	const ticketInserts = [];

	for (const category of categories) {
		for (const status of statuses) {
			const title = `${category.toUpperCase()} Ticket - ${status.replace(/_/g, " ")}`;
			const description = `This is a sample ${status} ticket under the ${category} category.`;

			ticketInserts.push(`
        (gen_random_uuid(), '${title}', '${description}', '${category}', '${status}', NOW(), NOW())
      `);
		}
	}

	pgm.sql(`
    INSERT INTO tickets (id, title, description, category, status, created_at, updated_at)
    VALUES ${ticketInserts.join(",\n")};
  `);
};

/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
export const down = async (pgm) => {
	pgm.sql(`
    DELETE FROM tickets
    WHERE title ILIKE '% Ticket - %';
  `);
};
