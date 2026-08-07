import { z } from "zod";

/** Zod schemas for admin forms — expand per entity as admin UI lands. */
export const adminEmailSchema = z.string().email();
