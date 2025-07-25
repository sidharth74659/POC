import { z } from "zod";

// Base schemas for common patterns
export const BaseEntitySchema = z.object({
  _id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
