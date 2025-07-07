import { ZodError } from "zod";

const formatZodError = (e: ZodError) => e.errors.map((error) => error.message);

export default formatZodError;
