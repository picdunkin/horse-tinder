import type { MatchRepository } from "@/src/application/repositories/match.repository.interface";
import type { Match } from "@/src/entities/models/match";

export class InMemoryMatchRepository implements MatchRepository {
  constructor(private matches: Match[] = []) {}

  async findActiveBetweenUsers(userId: string, otherUserId: string) {
    return (
      this.matches.find(
        (match) =>
          match.isActive &&
          ((match.user1Id === userId && match.user2Id === otherUserId) ||
            (match.user1Id === otherUserId && match.user2Id === userId)),
      ) ?? null
    );
  }

  async createActiveMatch(userId: string, otherUserId: string) {
    const [user1Id, user2Id] = [userId, otherUserId].sort();
    const match: Match = {
      id: `${user1Id}:${user2Id}`,
      user1Id,
      user2Id,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.matches.push(match);
    return match;
  }

  async listActiveByUserId(userId: string) {
    return this.matches.filter(
      (match) =>
        match.isActive && (match.user1Id === userId || match.user2Id === userId),
    );
  }
}
