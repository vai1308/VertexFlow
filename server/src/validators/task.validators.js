import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(1000).optional().default(""),
  status: z.enum(["Pending", "In Progress", "Completed"]).optional().default("Pending"),
  dueDate: z.string().datetime().optional().or(z.literal("")),
  assignee: z.string().optional().or(z.literal(""))
});

export const taskUpdateSchema = taskSchema.partial();
