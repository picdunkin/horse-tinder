import assert from "node:assert/strict";
import test from "node:test";
import {
  getAgeFromBirthdate,
  matchesAgePreference,
  matchesGenderPreference,
  type DatingProfile,
} from "@/src/entities/models/dating-profile";

const preference: {
  ageRange: { min: number; max: number };
  distanceKm: number;
  genderPreference: Array<"male" | "female" | "other">;
} = {
  ageRange: { min: 24, max: 32 },
  distanceKm: 50,
  genderPreference: ["female"],
};

const profile: DatingProfile = {
  id: "11111111-1111-1111-1111-111111111111",
  fullName: "Astra Mare",
  username: "astra",
  email: "astra@example.com",
  gender: "female",
  birthdate: "1998-01-01",
  bio: "Ready to match.",
  avatarUrl: "https://example.com/astra.png",
  preferences: {
    ageRange: { min: 21, max: 35 },
    distanceKm: 50,
    genderPreference: ["male"],
  },
  locationLat: null,
  locationLng: null,
  lastActiveAt: null,
  isVerified: true,
  isOnline: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

test("getAgeFromBirthdate returns a plausible age", () => {
  const age = getAgeFromBirthdate("2000-01-01");
  assert.ok(age >= 20);
  assert.ok(age <= 40);
});

test("dating-profile entity helpers respect gender and age preferences", () => {
  assert.equal(matchesGenderPreference(profile.gender, preference), true);
  assert.equal(matchesAgePreference(profile, preference), true);
  assert.equal(
    matchesGenderPreference("male", {
      ...preference,
      genderPreference: ["female"],
    }),
    false,
  );
});
