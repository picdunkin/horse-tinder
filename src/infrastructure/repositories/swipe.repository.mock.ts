import type { SwipeRepository } from "@/src/application/repositories/swipe.repository.interface";
import type { Swipe } from "@/src/entities/models/swipe";

export class InMemorySwipeRepository implements SwipeRepository {
  constructor(private swipes: Swipe[] = []) {}

  async listTargetIdsSwipedByUserId(userId: string) {
    return this.swipes
      .filter((swipe) => swipe.fromUserId === userId)
      .map((swipe) => swipe.toUserId);
  }

  async findLikeBetweenUsers(fromUserId: string, toUserId: string) {
    return (
      this.swipes.find(
        (swipe) =>
          swipe.fromUserId === fromUserId &&
          swipe.toUserId === toUserId &&
          swipe.direction === "like",
      ) ?? null
    );
  }

  async createLike(fromUserId: string, toUserId: string) {
    const swipe: Swipe = {
      fromUserId,
      toUserId,
      direction: "like",
      createdAt: new Date().toISOString(),
    };

    this.swipes.push(swipe);
    return swipe;
  }
}
