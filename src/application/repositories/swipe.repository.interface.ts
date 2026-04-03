import type { Swipe } from "@/src/entities/models/swipe";

export interface SwipeRepository {
  listTargetIdsSwipedByUserId(userId: string): Promise<string[]>;
  findLikeBetweenUsers(fromUserId: string, toUserId: string): Promise<Swipe | null>;
  createLike(fromUserId: string, toUserId: string): Promise<Swipe>;
}
