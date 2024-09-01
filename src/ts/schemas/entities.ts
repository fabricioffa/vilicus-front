import { z } from "../zod-config";

const categorySchema = z.object({
	id: z.coerce.number().positive().nullish(),
	name: z.string().trim().min(2).max(100),
	createdAt: z.coerce.date().nullish(),
	updatedAt: z.coerce.date().nullish(),
});

export type CategorySchemaType = typeof categorySchema
