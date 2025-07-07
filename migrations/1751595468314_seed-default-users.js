import { hashSync } from "bcryptjs";

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = async (pgm) => {
	// Create ENUM type for categories
	pgm.createType("category", [
		"technical",
		"billing",
		"general",
		"admissions",
		"it_support",
		"finance",
	]);

	pgm.alterColumn("users", "category", {
		type: "category",
		using: "category::category",
	});
	pgm.alterColumn("tickets", "category", {
		type: "category",
		using: "category::category",
	});

	const passwords = {
		technical: hashSync("tech123", 10),
		billing: hashSync("bill123", 10),
		general: hashSync("gen123", 10),
		admissions: hashSync("admit123", 10),
		it_support: hashSync("itsupport123", 10),
		finance: hashSync("finance123", 10),
	};

	pgm.sql(`
    INSERT INTO users (id, first_name, last_name, email, password_hash, category, created_at)
    VALUES
      (gen_random_uuid(), 'Technical', 'Admin', 'tech@nbu.edu.ng', '${passwords.technical}', 'technical', NOW()),
      (gen_random_uuid(), 'Billing', 'Admin', 'billing@nbu.edu.ng', '${passwords.billing}', 'billing', NOW()),
      (gen_random_uuid(), 'General', 'Admin', 'general@nbu.edu.ng', '${passwords.general}', 'general', NOW()),
      (gen_random_uuid(), 'Admissions', 'Admin', 'admissions@nbu.edu.ng', '${passwords.admissions}', 'admissions', NOW()),
      (gen_random_uuid(), 'IT', 'Support', 'itsupport@nbu.edu.ng', '${passwords.it_support}', 'it_support', NOW()),
      (gen_random_uuid(), 'Finance', 'Admin', 'finance@nbu.edu.ng', '${passwords.finance}', 'finance', NOW());
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = async (pgm) => {
	pgm.sql(`
    DELETE FROM users
    WHERE email IN (
      'tech@nbu.edu.ng',
      'billing@nbu.edu.ng',
      'general@nbu.edu.ng',
      'admissions@nbu.edu.ng',
      'itsupport@nbu.edu.ng',
      'finance@nbu.edu.ng'
    );
  `);

	pgm.alterColumn("users", "category", {
		type: "varchar(100)",
		using: "category::text",
	});
	pgm.alterColumn("tickets", "category", {
		type: "varchar(100)",
		using: "category::text",
	});
	pgm.dropType("category");
};
