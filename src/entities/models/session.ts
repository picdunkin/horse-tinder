import { z } from "zod";

export const SessionSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email().nullable().optional(),
});

export type Session = z.infer<typeof SessionSchema>;
