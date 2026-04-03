import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type {
  DatingProfile,
  UpdateDatingProfileInput,
} from "@/src/entities/models/dating-profile";
import { DatingProfileSchema } from "@/src/entities/models/dating-profile";
import type { DatingPreference } from "@/src/entities/models/dating-preference";
import type { SupabaseClient } from "@supabase/supabase-js";

interface UserRow {
  id: string;
  full_name: string;
  username: string;
  email: string | null;
  gender: "male" | "female" | "other";
  birthdate: string;
  bio: string | null;
  avatar_url: string | null;
  preferences: {
    age_range?: { min?: number; max?: number };
    distance?: number;
    gender_preference?: ("male" | "female" | "other")[];
  } | null;
  location_lat: number | null;
  location_lng: number | null;
  last_active: string | null;
  is_verified: boolean | null;
  is_online: boolean | null;
  created_at: string;
  updated_at: string;
}

function normalizePreferences(
  preferences: UserRow["preferences"],
): DatingPreference {
  return {
    ageRange: {
      min: preferences?.age_range?.min ?? 18,
      max: preferences?.age_range?.max ?? 99,
    },
    distanceKm: preferences?.distance ?? 50,
    genderPreference: preferences?.gender_preference ?? [],
  };
}

function mapUserRowToDatingProfile(row: UserRow): DatingProfile {
  return DatingProfileSchema.parse({
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    gender: row.gender,
    birthdate: row.birthdate,
    bio: row.bio ?? "",
    avatarUrl: row.avatar_url ?? "",
    preferences: normalizePreferences(row.preferences),
    locationLat: row.location_lat,
    locationLng: row.location_lng,
    lastActiveAt: row.last_active,
    isVerified: row.is_verified ?? false,
    isOnline: row.is_online ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapUpdateInputToRow(input: UpdateDatingProfileInput) {
  return {
    full_name: input.fullName,
    username: input.username,
    bio: input.bio,
    gender: input.gender,
    birthdate: input.birthdate,
    avatar_url: input.avatarUrl,
    preferences: input.preferences
      ? {
          age_range: {
            min: input.preferences.ageRange.min,
            max: input.preferences.ageRange.max,
          },
          distance: input.preferences.distanceKm,
          gender_preference: input.preferences.genderPreference ?? [],
        }
      : undefined,
    updated_at: new Date().toISOString(),
  };
}

export class SupabaseDatingProfileRepository implements DatingProfileRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return mapUserRowToDatingProfile(data as UserRow);
  }

  async getByIds(ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .in("id", ids);

    if (error || !data) {
      return [];
    }

    return (data as UserRow[]).map(mapUserRowToDatingProfile);
  }

  async listAll() {
    const { data, error } = await this.supabase.from("users").select("*");

    if (error || !data) {
      return [];
    }

    return (data as UserRow[]).map(mapUserRowToDatingProfile);
  }

  async updateById(id: string, input: UpdateDatingProfileInput) {
    const { data, error } = await this.supabase
      .from("users")
      .update(mapUpdateInputToRow(input))
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Failed to update profile.");
    }

    return mapUserRowToDatingProfile(data as UserRow);
  }
}
