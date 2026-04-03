import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type { MatchRepository } from "@/src/application/repositories/match.repository.interface";
import type { SwipeRepository } from "@/src/application/repositories/swipe.repository.interface";
import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import type { InstrumentationService } from "@/src/application/services/instrumentation.service.interface";
import type { TransactionManagerService } from "@/src/application/services/transaction-manager.service.interface";
import { NotAuthenticatedError } from "@/src/entities/errors/auth";
import {
  InvalidLikeError,
  ProfileNotFoundError,
} from "@/src/entities/errors/dating";

export class SwipeOnProfileUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly datingProfileRepository: DatingProfileRepository,
    private readonly swipeRepository: SwipeRepository,
    private readonly matchRepository: MatchRepository,
    private readonly transactionManagerService: TransactionManagerService,
    private readonly instrumentationService: InstrumentationService,
  ) {}

  async execute(targetUserId: string) {
    const session = await this.authenticationService.getCurrentSession();
    if (!session) {
      throw new NotAuthenticatedError();
    }

    if (session.userId === targetUserId) {
      throw new InvalidLikeError("You cannot like your own profile.");
    }

    const targetProfile = await this.datingProfileRepository.getById(targetUserId);
    if (!targetProfile) {
      throw new ProfileNotFoundError();
    }

    return this.transactionManagerService.run(async () => {
      const existingSwipe = await this.swipeRepository.findLikeBetweenUsers(
        session.userId,
        targetUserId,
      );

      if (existingSwipe) {
        throw new InvalidLikeError("You already liked this profile.");
      }

      await this.swipeRepository.createLike(session.userId, targetUserId);

      const reciprocalSwipe = await this.swipeRepository.findLikeBetweenUsers(
        targetUserId,
        session.userId,
      );

      let isMatch = false;
      if (reciprocalSwipe) {
        const existingMatch = await this.matchRepository.findActiveBetweenUsers(
          session.userId,
          targetUserId,
        );

        if (!existingMatch) {
          await this.matchRepository.createActiveMatch(
            session.userId,
            targetUserId,
          );
        }

        isMatch = true;
      }

      await this.instrumentationService.track("dating.profile_liked", {
        userId: session.userId,
        targetUserId,
        isMatch,
      });

      return {
        isMatch,
        matchedProfile: isMatch ? targetProfile : null,
      };
    });
  }
}
