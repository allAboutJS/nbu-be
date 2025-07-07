/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = async (pgm) => {
	pgm.createFunction(
		"update_updated_at_column",
		[],
		{
			returns: "trigger",
			language: "plpgsql",
		},
		`
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    `,
	);

	pgm.createTrigger("tickets", "set_updated_at", {
		when: "BEFORE",
		operation: "UPDATE",
		function: "update_updated_at_column",
		level: "ROW",
	});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = async (pgm) => {
	pgm.dropTrigger("tickets", "set_updated_at");
	pgm.dropFunction("update_updated_at_column");
};
