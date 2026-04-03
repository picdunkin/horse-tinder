import { z } from "zod";

export const SwipeDirectionSchema = z.enum(["like", "pass"]);

export const SwipeSchema = z.object({
  fromUserId: z.string().uuid(),
  toUserId: z.string().uuid(),
  direction: SwipeDirectionSchema,
  createdAt: z.string(),
});

export type Swipe = z.infer<typeof SwipeSchema>;
export type SwipeDirection = z.infer<typeof SwipeDirectionSchema>;
