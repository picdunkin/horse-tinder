import type { MatchRepository } from "@/src/application/repositories/match.repository.interface";
import type { Match } from "@/src/entities/models/match";
import { MatchSchema } from "@/src/entities/models/match";
import type { SupabaseClient } from "@supabase/supabase-js";

interface MatchRow {
  id?: string;
  user1_id: string;
  user2_id: string;
  is_active: boolean;
  created_at: string;
}

function mapMatchRow(row: MatchRow): Match {
  return MatchSchema.parse({
    id: row.id ?? `${row.user1_id}:${row.user2_id}`,
    user1Id: row.user1_id,
    user2Id: row.user2_id,
    isActive: row.is_active,
    createdAt: row.created_at,
  });
}

export class SupabaseMatchRepository implements MatchRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findActiveBetweenUsers(userId: string, otherUserId: string) {
    const { data, error } = await this.supabase
      .from("matches")
      .select("*")
      .or(
        `and(user1_id.eq.${userId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${userId})`,
      )
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return null;
    }

    return mapMatchRow(data as MatchRow);
  }

  async createActiveMatch(userId: string, otherUserId: string) {
    const [user1Id, user2Id] = [userId, otherUserId].sort();
    const { data, error } = await this.supabase
      .from("matches")
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
        is_active: true,
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Failed to create match.");
    }

    return mapMatchRow(data as MatchRow);
  }

  async listActiveByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from("matches")
      .select("*")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq("is_active", true);

    if (error || !data) {
      return [];
    }

    return (data as MatchRow[]).map(mapMatchRow);
  }
}
