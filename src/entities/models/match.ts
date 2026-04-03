import { z } from "zod";

export const MatchSchema = z.object({
  id: z.string(),
  user1Id: z.string().uuid(),
  user2Id: z.string().uuid(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export type Match = z.infer<typeof MatchSchema>;
