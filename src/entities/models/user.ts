import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable().optional(),
  fullName: z.string().min(1),
  username: z.string().min(1),
  avatarUrl: z.string().default(""),
});

export type User = z.infer<typeof UserSchema>;
