import { z } from "zod";

export const orgSelectSchema = z.object({
  orgId: z.string().min(1, "Please select an organization."),
});

export type OrgSelectSchema = z.infer<typeof orgSelectSchema>;
