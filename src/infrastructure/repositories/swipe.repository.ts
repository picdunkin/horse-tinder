import type { SwipeRepository } from "@/src/application/repositories/swipe.repository.interface";
import type { Swipe } from "@/src/entities/models/swipe";
import { SwipeSchema } from "@/src/entities/models/swipe";
import type { SupabaseClient } from "@supabase/supabase-js";

interface LikeRow {
  from_user_id: string;
  to_user_id: string;
  created_at?: string;
}

function mapLikeRowToSwipe(row: LikeRow): Swipe {
  return SwipeSchema.parse({
    fromUserId: row.from_user_id,
    toUserId: row.to_user_id,
    direction: "like",
    createdAt: row.created_at ?? new Date().toISOString(),
  });
}

export class SupabaseSwipeRepository implements SwipeRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listTargetIdsSwipedByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from("likes")
      .select("to_user_id")
      .eq("from_user_id", userId);

    if (error || !data) {
      return [];
    }

    return (data as Array<{ to_user_id: string }>).map((row) => row.to_user_id);
  }

  async findLikeBetweenUsers(fromUserId: string, toUserId: string) {
    const { data, error } = await this.supabase
      .from("likes")
      .select("*")
      .eq("from_user_id", fromUserId)
      .eq("to_user_id", toUserId)
      .single();

    if (error || !data) {
      return null;
    }

    return mapLikeRowToSwipe(data as LikeRow);
  }

  async createLike(fromUserId: string, toUserId: string) {
    const { data, error } = await this.supabase
      .from("likes")
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Failed to create like.");
    }

    return mapLikeRowToSwipe(data as LikeRow);
  }
}
