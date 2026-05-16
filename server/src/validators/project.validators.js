import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(600).optional().default("")
});

export const memberSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(80).optional(),
  role: z.enum(["Admin", "Member"]).default("Member")
});

export const memberRoleSchema = z.object({
  role: z.enum(["Admin", "Member"])
});
