import type { Match } from "@/src/entities/models/match";

export interface MatchRepository {
  findActiveBetweenUsers(userId: string, otherUserId: string): Promise<Match | null>;
  createActiveMatch(userId: string, otherUserId: string): Promise<Match>;
  listActiveByUserId(userId: string): Promise<Match[]>;
}
