import { z } from "zod";

export const GenderSchema = z.enum(["male", "female", "other"]);

export const DatingPreferenceSchema = z
  .object({
    ageRange: z.object({
      min: z.number().int().min(18),
      max: z.number().int().max(120),
    }),
    distanceKm: z.number().int().min(1).max(500),
    genderPreference: z.array(GenderSchema).optional().default([]),
  })
  .refine((value) => value.ageRange.min <= value.ageRange.max, {
    message: "Minimum age must be less than or equal to maximum age.",
    path: ["ageRange", "max"],
  });

export type Gender = z.infer<typeof GenderSchema>;
export type DatingPreference = z.infer<typeof DatingPreferenceSchema>;
