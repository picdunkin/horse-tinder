import { z } from "zod";
import {
  DatingPreferenceSchema,
  GenderSchema,
  type DatingPreference,
  type Gender,
} from "./dating-preference";

export const DatingProfileSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email().optional().nullable(),
  gender: GenderSchema,
  birthdate: z.string().min(1),
  bio: z.string().default(""),
  avatarUrl: z.string().default(""),
  preferences: DatingPreferenceSchema,
  locationLat: z.number().nullable().optional(),
  locationLng: z.number().nullable().optional(),
  lastActiveAt: z.string().nullable().optional(),
  isVerified: z.boolean().default(false),
  isOnline: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UpdateDatingProfileInputSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required."),
  username: z.string().trim().min(1, "Username is required."),
  bio: z
    .string()
    .trim()
    .min(1, "Bio is required.")
    .max(500, "Bio must be 500 characters or fewer."),
  gender: GenderSchema,
  birthdate: z.string().min(1, "Birthdate is required."),
  avatarUrl: z.string().default(""),
  preferences: DatingPreferenceSchema.optional(),
});

export type DatingProfile = z.infer<typeof DatingProfileSchema>;
export type UpdateDatingProfileInputPayload = z.input<
  typeof UpdateDatingProfileInputSchema
>;
export type UpdateDatingProfileInput = z.infer<
  typeof UpdateDatingProfileInputSchema
>;

export function getAgeFromBirthdate(birthdate: string): number {
  const today = new Date();
  const birthDate = new Date(birthdate);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

export function matchesGenderPreference(
  profileGender: Gender,
  preference: DatingPreference,
): boolean {
  if (preference.genderPreference.length === 0) {
    return true;
  }

  return preference.genderPreference.includes(profileGender);
}

export function matchesAgePreference(
  profile: DatingProfile,
  preference: DatingPreference,
): boolean {
  const age = getAgeFromBirthdate(profile.birthdate);

  return age >= preference.ageRange.min && age <= preference.ageRange.max;
}
